from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)


# =========================================
# HOME
# =========================================

@app.route("/")
def home():
    return jsonify({
        "message": "CampusPulse backend is running!"
    })


# =========================================
# ANALYZE DATASET
# =========================================

@app.route("/analyze", methods=["POST"])
def analyze():

    try:

        # =========================================
        # CHECK FILE
        # =========================================

        if "file" not in request.files:

            return jsonify({
                "error": "No file uploaded"
            }), 400

        file = request.files["file"]

        print("================================")
        print("FILE RECEIVED:", file.filename)

        # =========================================
        # READ CSV
        # =========================================

        df = pd.read_csv(file)

        # Clean column names
        df.columns = (
            df.columns
            .str.strip()
            .str.lower()
        )

        print("COLUMNS RECEIVED:")
        print(df.columns.tolist())
        print("SHAPE:", df.shape)
        print("================================")

        # =========================================
        # REQUIRED COLUMNS
        # =========================================

        required_columns = [
            "placed",
            "cgpa",
            "branch",
            "internships",
            "package_lpa"
        ]

        missing_columns = [
            column
            for column in required_columns
            if column not in df.columns
        ]

        if missing_columns:

            return jsonify({
                "error": "Missing required column(s): "
                         + ", ".join(missing_columns)
            }), 400

        # =========================================
        # BASIC STATISTICS
        # =========================================

        total_students = len(df)

        placed_values = pd.to_numeric(
            df["placed"],
            errors="coerce"
        ).fillna(0)

        placed_count = placed_values.sum()

        placement_rate = (
            placed_count / total_students * 100
            if total_students > 0
            else 0
        )

        # =========================================
        # AVERAGE CGPA
        # =========================================

        average_cgpa = pd.to_numeric(
            df["cgpa"],
            errors="coerce"
        ).mean()

        # =========================================
        # AVERAGE PACKAGE
        # =========================================

        package_data = pd.to_numeric(
            df["package_lpa"],
            errors="coerce"
        )

        placed_mask = placed_values == 1

        average_package = (
            package_data[placed_mask].mean()
            if placed_mask.sum() > 0
            else 0
        )

        # =========================================
        # BRANCH-WISE PLACEMENT
        # =========================================

        branch_data = []

        for branch, group in df.groupby("branch"):

            students = len(group)

            placed = pd.to_numeric(
                group["placed"],
                errors="coerce"
            ).fillna(0).sum()

            rate = (
                placed / students * 100
                if students > 0
                else 0
            )

            branch_data.append({

                "branch": str(branch),

                "placement_rate": round(
                    rate,
                    2
                )

            })

        # =========================================
        # CGPA VS PLACEMENT
        # =========================================

        df["cgpa_numeric"] = pd.to_numeric(
            df["cgpa"],
            errors="coerce"
        )

        def cgpa_group(cgpa):

            if pd.isna(cgpa):
                return "Unknown"

            if cgpa < 6:
                return "Below 6"

            elif cgpa < 7:
                return "6–7"

            elif cgpa < 8:
                return "7–8"

            elif cgpa < 9:
                return "8–9"

            else:
                return "9+"

        df["cgpa_group"] = df[
            "cgpa_numeric"
        ].apply(cgpa_group)

        cgpa_order = [
            "Below 6",
            "6–7",
            "7–8",
            "8–9",
            "9+"
        ]

        cgpa_data = []

        for group_name in cgpa_order:

            group = df[
                df["cgpa_group"] == group_name
            ]

            if len(group) == 0:

                rate = 0

            else:

                placed = pd.to_numeric(
                    group["placed"],
                    errors="coerce"
                ).fillna(0).sum()

                rate = (
                    placed / len(group) * 100
                )

            cgpa_data.append({

                "group": group_name,

                "placement_rate": round(
                    rate,
                    2
                )

            })

        # =========================================
        # INTERNSHIP VS PLACEMENT
        # =========================================

        df["internships_numeric"] = pd.to_numeric(
            df["internships"],
            errors="coerce"
        ).fillna(0)

        internship_data = []

        for has_internship, group in df.groupby(
            df["internships_numeric"] > 0
        ):

            students = len(group)

            placed = pd.to_numeric(
                group["placed"],
                errors="coerce"
            ).fillna(0).sum()

            rate = (
                placed / students * 100
                if students > 0
                else 0
            )

            internship_data.append({

                "category": (
                    "Internship"
                    if has_internship
                    else "No Internship"
                ),

                "placement_rate": round(
                    rate,
                    2
                )

            })

        # =========================================
        # RETURN ANALYSIS
        # =========================================

        return jsonify({

            "message":
                "File analyzed successfully!",

            "rows":
                total_students,

            "columns":
                list(df.columns),

            "overview": {

                "total_students":
                    total_students,

                "placement_rate":
                    round(
                        placement_rate,
                        2
                    ),

                "average_cgpa":
                    round(
                        average_cgpa,
                        2
                    ),

                "average_package":
                    round(
                        average_package,
                        2
                    )

            },

            "branch_data":
                branch_data,

            "cgpa_data":
                cgpa_data,

            "internship_data":
                internship_data

        })

    # =========================================
    # ERROR HANDLING
    # =========================================

    except Exception as e:

        print("ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 400


# =========================================
# RUN SERVER
# =========================================

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5000
    )
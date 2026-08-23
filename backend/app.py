from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd


# =========================================
# CAMPUSPULSE FLASK APP
# =========================================

app = Flask(__name__)
CORS(app)


# =========================================
# HOME
# =========================================

@app.route("/", methods=["GET"])
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

        # -----------------------------------------
        # CHECK FILE
        # -----------------------------------------

        if "file" not in request.files:

            return jsonify({
                "error": "No file uploaded."
            }), 400


        file = request.files["file"]


        if file.filename == "":

            return jsonify({
                "error": "No file selected."
            }), 400


        # -----------------------------------------
        # CHECK FILE TYPE
        # -----------------------------------------

        filename = file.filename.lower()


        if filename.endswith(".csv"):

            df = pd.read_csv(file)


        elif filename.endswith(".xlsx"):

            df = pd.read_excel(file)


        else:

            return jsonify({
                "error": "Unsupported file type. Please upload a CSV or XLSX file."
            }), 400


        # -----------------------------------------
        # CLEAN COLUMN NAMES
        # -----------------------------------------

        df.columns = (
            df.columns
            .astype(str)
            .str.strip()
        )


        # -----------------------------------------
        # REQUIRED COLUMNS
        # -----------------------------------------

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

                "error":
                    "Missing required column(s): "
                    + ", ".join(missing_columns)

            }), 400


        # =========================================
        # BASIC STATISTICS
        # =========================================

        total_students = len(df)


        # -----------------------------------------
        # PLACED
        # -----------------------------------------

        placed_numeric = pd.to_numeric(
            df["placed"],
            errors="coerce"
        ).fillna(0)


        placed_count = placed_numeric.sum()


        placement_rate = (

            placed_count /
            total_students *
            100

            if total_students > 0
            else 0

        )


        # -----------------------------------------
        # CGPA
        # -----------------------------------------

        cgpa_numeric = pd.to_numeric(
            df["cgpa"],
            errors="coerce"
        )


        average_cgpa = cgpa_numeric.mean()


        if pd.isna(average_cgpa):

            average_cgpa = 0


        # =========================================
        # AVERAGE PACKAGE
        # =========================================

        package_numeric = pd.to_numeric(
            df["package_lpa"],
            errors="coerce"
        )


        placed_mask = (
            placed_numeric == 1
        )


        if placed_mask.sum() > 0:

            average_package = (
                package_numeric[
                    placed_mask
                ].mean()
            )

        else:

            average_package = 0


        if pd.isna(average_package):

            average_package = 0


        # =========================================
        # BRANCH-WISE ANALYSIS
        # =========================================

        branch_data = []


        for branch, group in df.groupby(
            "branch",
            dropna=False
        ):

            students = len(group)


            group_placed = pd.to_numeric(
                group["placed"],
                errors="coerce"
            ).fillna(0)


            placed = group_placed.sum()


            placement_rate_branch = (

                placed /
                students *
                100

                if students > 0
                else 0

            )


            # -----------------------------------------
            # Branch average package
            # -----------------------------------------

            group_package = pd.to_numeric(
                group["package_lpa"],
                errors="coerce"
            )


            group_placed_mask = (
                group_placed == 1
            )


            if group_placed_mask.sum() > 0:

                branch_average_package = (
                    group_package[
                        group_placed_mask
                    ].mean()
                )

            else:

                branch_average_package = 0


            if pd.isna(branch_average_package):

                branch_average_package = 0


            branch_name = str(branch)


            if branch_name == "nan":

                branch_name = "Unknown"


            branch_data.append({

                "branch": branch_name,

                "placement_rate":
                    round(
                        placement_rate_branch,
                        2
                    ),

                "average_package":
                    round(
                        branch_average_package,
                        2
                    )

            })


        # Sort branches alphabetically

        branch_data = sorted(
            branch_data,
            key=lambda x: x["branch"]
        )


        # =========================================
        # CGPA VS PLACEMENT
        # =========================================

        def get_cgpa_group(cgpa):

            if pd.isna(cgpa):
                return None

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


        df["cgpa_group"] = (
            cgpa_numeric.apply(
                get_cgpa_group
            )
        )


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

                group_placed = pd.to_numeric(
                    group["placed"],
                    errors="coerce"
                ).fillna(0)


                placed = group_placed.sum()


                rate = (
                    placed /
                    len(group) *
                    100
                )


            cgpa_data.append({

                "group": group_name,

                "placement_rate":
                    round(rate, 2)

            })


        # =========================================
        # INTERNSHIP VS PLACEMENT
        # =========================================

        internships_numeric = pd.to_numeric(
            df["internships"],
            errors="coerce"
        ).fillna(0)


        internship_categories = [

            ("Internship", internships_numeric > 0),

            ("No Internship", internships_numeric <= 0)

        ]


        internship_data = []


        for category, mask in internship_categories:

            group = df[mask]


            if len(group) == 0:

                rate = 0

            else:

                group_placed = pd.to_numeric(
                    group["placed"],
                    errors="coerce"
                ).fillna(0)


                placed = group_placed.sum()


                rate = (
                    placed /
                    len(group) *
                    100
                )


            internship_data.append({

                "category": category,

                "placement_rate":
                    round(rate, 2)

            })


        # =========================================
        # RESPONSE DATA
        # =========================================

        response = {

            "message":
                "File analyzed successfully!",

            "filename":
                file.filename,

            "file_type":
                (
                    "CSV"
                    if filename.endswith(".csv")
                    else "XLSX"
                ),

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

        }


        # -----------------------------------------
        # PRINT RESULT IN TERMINAL
        # -----------------------------------------

        print()
        print("========================================")
        print("CampusPulse analysis completed")
        print("File:", file.filename)
        print("Rows:", total_students)
        print(
            "Placement rate:",
            round(placement_rate, 2)
        )
        print("========================================")
        print()


        return jsonify(response)


    # =========================================
    # ERROR HANDLING
    # =========================================

    except Exception as e:

        print()
        print("========================================")
        print("CAMPUSPULSE ERROR")
        print(str(e))
        print("========================================")
        print()


        return jsonify({

            "error": str(e)

        }), 400


# =========================================
# RUN SERVER
# =========================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
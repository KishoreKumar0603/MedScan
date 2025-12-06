import streamlit as st
import requests
import json

st.set_page_config(page_title="MedScan OCR Demo", layout="wide")
st.title("📄 MedScan – OCR & Medical NLP Demo")
st.write("Upload a handwritten / printed prescription and get structured medical data.")

uploaded_file = st.file_uploader("Upload Prescription Image", type=["jpg", "jpeg", "png", "pdf"])

API_URL = "http://127.0.0.1:5001/extract"

if uploaded_file is not None:

    st.image(uploaded_file, caption="Uploaded Prescription", use_column_width=True)

    if st.button("🔍 Process Document"):
        with st.spinner("Processing with PaddleOCR + SciSpaCy..."):
            files = {"file": (uploaded_file.name, uploaded_file.getvalue())}

            try:
                response = requests.post(API_URL, files=files)

                if response.status_code == 200:
                    data = response.json()

                    st.success("Processing Complete!")

                    st.subheader("📝 Extracted OCR Text")
                    st.text_area("OCR Output", data["raw_text"], height=200)

                    st.subheader("🔬 Extracted Medical Entities")
                    if len(data["entities"]) > 0:
                        for ent in data["entities"]:
                            st.markdown(
                                f"- **{ent['text']}** — *{ent['label']}*"
                            )
                    else:
                        st.info("No medical entities found.")

                    st.subheader("💊 Medicines & Dosage")
                    if len(data["medicines"]) > 0:
                        for med in data["medicines"]:
                            st.markdown(
                                f"- **{med['medicine']}** – `{med['dosage']}`"
                            )
                    else:
                        st.info("No medicine patterns detected.")

                    st.subheader("📦 JSON Output")
                    st.json(data)

                else:
                    st.error(f"API Error: {response.status_code}")
                    st.write(response.text)

            except Exception as e:
                st.error("Failed to connect to Flask API.")
                st.write(e)

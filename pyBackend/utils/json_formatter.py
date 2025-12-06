# utils/json_formatter.py

def format_medscan_output(raw_text, entities, medicines):
    """
    Convert extracted results into MedScan JSON format.
    """

    return {
        "status": "success",
        "raw_text": raw_text,
        "entities": entities,
        "medicines": medicines,
        "total_entities": len(entities),
        "total_medicines": len(medicines)
    }

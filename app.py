#!/usr/bin/env python3
"""
Ponto de entrada para o deploy no Render
"""
from src.main import app

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port, debug=False)

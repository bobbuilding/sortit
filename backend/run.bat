@echo off
echo Starting SortIT Backend...
call venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
pause

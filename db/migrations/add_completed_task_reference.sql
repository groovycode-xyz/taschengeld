ALTER TABLE piggybank_transactions
ADD COLUMN completed_task_id INTEGER REFERENCES completed_tasks(c_task_id);

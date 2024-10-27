# **Introduction**

This script exports the entire schema of the tgeld database to a file called schema_dump.txt.

# **Shell Script**

```
./db-dump.sh
```

## **Script Explanation**

1. Shebang (#!/bin/bash):
   Specifies that the script should be run in the Bash shell.

2. Set the Database Password:

- export PGPASSWORD='\*R2?c6M$uvEg'\''eD': Sets the PGPASSWORD environment variable with your database password. The single quote in the password is escaped using '\''.

3. Run pg_dump:

- pg_dump -U tgeld_admin -h localhost -p 5432 -s tgeld > schema_dump.txt: Executes the pg_dump command to export the schema of the tgeld database into schema_dump.txt.

4. Unset the Database Password:

- unset PGPASSWORD: Removes the PGPASSWORD environment variable to ensure the password isn't stored in the environment longer than necessary.

5. Confirmation Message:

- echo "Database schema has been exported to schema_dump.txt": Prints a confirmation message upon successful execution.

# **Or Single Line Command**

```
PGPASSWORD='*R2?c6M$uvEg'\''eD' pg_dump -U tgeld_admin -h localhost -p 5432 -s tgeld > schema_dump.txt
```

# **Explanation**

This command uses pg_dump to export the entire schema of your PostgreSQL database named tgeld into a file called schema_dump.txt. Here's a breakdown of the command:

- PGPASSWORD='\*R2?c6M$uvEg'\''eD': Sets the environment variable PGPASSWORD with your database password. The single quote in the password is escaped using '\''.

- pg_dump: The PostgreSQL utility for backing up a database.

- -U tgeld_admin: Specifies the database user.

- -h localhost: Specifies the host where the database is running.

- -p 5432: Specifies the port number.

- -s: Dumps only the schema without any data.

- tgeld: The name of the database to dump.

- > schema_dump.txt: Redirects the output to the file schema_dump.txt.

Note: Ensure that pg_dump is installed on your system. If it's not, you can install it using Homebrew:

```
brew install postgresql
```

After running the command, you'll find the schema_dump.txt file in your current directory containing the entire database schema.

# **Additional Tips**

- Environment Variables: Ensure that your .env.local file is correctly configured and that the environment variables are properly loaded when running commands.

- Security Consideration: Be cautious with sensitive information like database passwords. Consider using more secure methods to handle credentials, such as using .pgpass files or environment variables without exposing them in command history.

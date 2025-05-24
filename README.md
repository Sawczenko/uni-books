## Uni-books


### Setup
- Install MariaDB
- Run the following sql script:
```sql
CREATE DATABASE IF NOT EXISTS `books`;
CREATE USER IF NOT EXISTS 'books-user'@'localhost' IDENTIFIED BY 'pass';
GRANT ALL PRIVILEGES ON `books`.* TO 'books-user'@'localhost';
FLUSH PRIVILEGES;
```
- Migrate the database:
```bash
mysql -u books-user -ppass books < drizzle/0000_bouncy_harry_osborn.sql
mysql -u books-user -ppass books < drizzle/0001_seed.sql
```
- Install node dependencies:
```bash
npm install
```

### Running in development
npm run dev

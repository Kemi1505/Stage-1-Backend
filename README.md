# 🧩 String Analyzer API

This API is built with NestJs and analyzes and filters strings based on their properties such as length, palindrome status, word count, and character frequency.  
**Cool Fact:** It also supports natural language queries like “all single word palindromic strings”.

---

## 🚀 What it does

- Add and analyze new strings
- Retrieve all stored strings with filter options
- Parse and filter results from **natural language queries**
- Built with **NestJS**, Database: **TypeORM** and **PostgreSQL**

---

## ⚙️ Technologies Used

- **NestJS**
- **TypeScript**
- **PostgreSQL**
- **TypeORM**

---

## 🔧 Installation and Setup

### 1 Clone the repository

```bash
git clone https://github.com/Kemi1505/Stage-1-Backend.git
cd string-analyzer
```

### 2 Install dependencies

```bash
npm install
```

### 3 Create .env in project root

```bash
.env example:

PORT=3000
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=name
```

### 4 Create the Postgres database

```bash
CREATE DATABASE name;
```

### 5 Run the development server

```bash
npm run start:dev
```

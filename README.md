## Подготовка окружения для запуска приложения

1. Установить nvm https://github.com/nvm-sh/nvm
2. Установить docker и docker compose https://docs.docker.com/engine/install/

## Первый запуск проекта

1. Установите зависимости
```bash
  nvm install
  nvm use # 
  npm i
```

2. Подготовьте `.env` файл на основе `.env.example`

- Для генерации `JWT_SECRET` можете воспользоваться командой `openssl rand -hex 16`
- Для генерации `SALT` можете воспользоваться следующим скриптом в консоли node
```bash
➜  BrassBookApi-by-zhaba git:(feature/base-setup) ✗ node
Welcome to Node.js v20.18.0.
Type ".help" for more information.
> const bсrypt = require('bcrypt')
undefined
>  const salt = await bсrypt.genSalt(10)
undefined
> salt
'$2b$10$Fr9fol/23vaGw5lZR7V7De'
> 
```
- DATABASE_URL для использования с тестовой базой данных нужно задавать в формате `postgres://nahvcimm:${process.env.DB_PASS}@surus.db.elephantsql.com/nahvcimm`

3. Запустите проект

```bash
  npm start
```


## Возможные проблемы

1. Проблема с запуском базы данных

Уберите флаг detach из запуска docker compose, чтобы было так
```
"dev:docker": "sudo docker compose -f ./docker/docker-compose-development.yml up --build",
```

После отдельно запустите `npm run dev:docker` и посмотрите на логи

2. Нет доступа до пароля для отправки кода из почты

Воспользуйтесь просмотром состояния базы данных через консольную утилиту psql внутри контейнера docker,
либо через любой GUI, например PgAdmin, и посмотрите значение записи `code` в таблице users.
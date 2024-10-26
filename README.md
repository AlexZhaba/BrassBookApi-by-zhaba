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

- Для генерации `SALT` и `JWT_SECRET` можете воспользоваться командой `openssl rand -hex 16`
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

#!/bin/bash

# chmod +x node-port-impact-control.sh  # 최초 1회 실행권한 부여
# ./node-port-impact-control.sh start    # 실행
# ./node-port-impact-control.sh restart  # 재시작
# ./node-port-impact-control.sh stop     # 중지
# ./node-port-impact-control.sh delete   # 삭제
# ./node-port-impact-control.sh status   # 상태 보기
# ./node-port-impact-control.sh log      # 로그 확인

# ========================
# 📍 실행 전 환경설정
# ========================
APP_NAME="wayple-api"
APP_PATH="/home/wayple/wayple/backend/dist/main.js"
PROJECT_ROOT="/home/wayple/wayple/backend"
PORT=3001

# ========================
# ✅ 포트 점유 종료 함수
# ========================
function kill_port() {
  PID=$(lsof -ti tcp:$PORT)
  if [ -n "$PID" ]; then
    echo "⚠️  Port $PORT is in use by PID $PID. Killing it..."
    kill -9 $PID
    sleep 1
  else
    echo "✅ Port $PORT is free."
  fi
}

# ========================
# ✅ 빌드 및 PM2 실행
# ========================
function start_pm2() {
  echo "🧹 Cleaning old build..."
  rm -rf $PROJECT_ROOT/dist

  echo "🛠️  Building project..."
  cd $PROJECT_ROOT
  npm run build

  echo "🚀 Starting $APP_NAME on port $PORT..."
  pm2 delete $APP_NAME >/dev/null 2>&1
  pm2 start $APP_PATH --name $APP_NAME
  pm2 save
}

# ========================
# ✅ 명령어 처리
# ========================
case "$1" in
  start)
    kill_port
    start_pm2
    ;;
  stop)
    echo "🛑 Stopping $APP_NAME..."
    pm2 delete $APP_NAME
    ;;
  restart)
    kill_port
    start_pm2
    ;;
  *)
    echo "Usage: $0 {start|stop|restart}"
    ;;
esac

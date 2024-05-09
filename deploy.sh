git pull
pm2 delete "siu"
npm run build
pm2 start -i 1 npm --name 'siu' -- start


# Supply the string after "_" as arg to use alternative frontend config.
# E.g. "test", lanchart", "memotest", "memotest_all", "all".

# The -z switch will test if the expansion of "$1" is a null string or not.
if [ -z "$1" ]
  then
    configdir=/opt/korp-frontend-config/app
else
	configdir=/opt/korp-frontend-config/app_$1
fi


cp -r $configdir/* /opt/korp-frontend/app/ &&
yarn build &&
yarn start:dist

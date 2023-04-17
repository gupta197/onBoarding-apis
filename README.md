# onBoarding-apis
In the OnBoarding, we are providing login, signup, 2-factor authentication, reset the password, and forget the password.

## Installation

Use the package manager [nodejs](https://nodejs.org/en) to install OnBoarding.
Follow the below step to setup onBoarding

Step 1
```bash
git clone https://github.com/gupta197/onBoarding-apis.git
```
Step 2
```bash
cd onBoarding-apis
```
Step 3
```bash
npm install
```
Step 4

Update All the cred according to your configuration. you Have to update .env for successful setup

Step 5
```bash
npm start
``` 

You will get the link where is all the API is running.


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## POSTMAN
here is postman api for reference
```
{
	"info": {
		"_postman_id": "f4c5f781-1d83-4609-be57-66656d410872",
		"name": "Authication APIS",
		"schema": "https://schema.getpostman.com/json/collection/v2.0.0/collection.json",
		"_exporter_id": "21017839"
	},
	"item": [
		{
			"name": "Login",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "urlencoded",
					"urlencoded": [
						{
							"key": "email",
							"value": "defrozetroija-7060@yopmail.com",
							"type": "text"
						},
						{
							"key": "password",
							"value": "pass1",
							"type": "text"
						},
						{
							"key": "first_name",
							"value": "test",
							"type": "text"
						},
						{
							"key": "last_name",
							"value": "user",
							"type": "text"
						}
					]
				},
				"url": "localhost:8080/login"
			},
			"response": []
		},
		{
			"name": "get userDetail",
			"request": {
				"auth": {
					"type": "bearer",
					"bearer": {
						"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MDcxMGEzNDJlYWNjOTY0YTk5MGU0NSIsImlhdCI6MTY3ODE4NDkyNSwiZXhwIjoxNjc4MTkyMTI1fQ.FlBB69WhmPQFk8v5VFviIBeounxajorrfjykwRL0CiE"
					}
				},
				"method": "GET",
				"header": [
					{
						"key": "x-access-token",
						"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MzA0ZDNmM2Q0OWQ0MzE2N2VhNDEyNiIsInVzZXJJZCI6IjExNDQ0MCIsImlhdCI6MTY4MTE5MjM2NCwiZXhwIjoxNjgxMTk5NTY0fQ.HbPUPLE6gT5YYlBHNDqwHOndqQlKbj17L5GuVjLH_ZM",
						"type": "text"
					}
				],
				"url": "localhost:8080/user"
			},
			"response": []
		},
		{
			"name": "verify Email",
			"request": {
				"auth": {
					"type": "bearer",
					"bearer": {
						"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MDcxMGEzNDJlYWNjOTY0YTk5MGU0NSIsImlhdCI6MTY3ODE4NDkyNSwiZXhwIjoxNjc4MTkyMTI1fQ.FlBB69WhmPQFk8v5VFviIBeounxajorrfjykwRL0CiE"
					}
				},
				"method": "GET",
				"header": [
					{
						"key": "x-access-token",
						"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MDcxMGEzNDJlYWNjOTY0YTk5MGU0NSIsImlhdCI6MTY3ODE4NDkyNSwiZXhwIjoxNjc4MTkyMTI1fQ.FlBB69WhmPQFk8v5VFviIBeounxajorrfjykwRL0CiE",
						"type": "text",
						"disabled": true
					}
				],
				"url": {
					"raw": "http://localhost:8080/verifyEmail?q=69237",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "8080",
					"path": [
						"verifyEmail"
					],
					"query": [
						{
							"key": "q",
							"value": "69237"
						}
					]
				}
			},
			"response": []
		},
		{
			"name": "Register User",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "urlencoded",
					"urlencoded": [
						{
							"key": "email",
							"value": "defrozetroija-7060@yopmail.com",
							"type": "text"
						},
						{
							"key": "password",
							"value": "pass",
							"type": "text"
						},
						{
							"key": "firstName",
							"value": "test",
							"type": "text"
						},
						{
							"key": "lastName",
							"value": "user",
							"type": "text"
						}
					]
				},
				"url": "localhost:8080/register"
			},
			"response": []
		},
		{
			"name": "Forget Password",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "urlencoded",
					"urlencoded": [
						{
							"key": "email",
							"value": "defrozetroija-7060@yopmail.com",
							"type": "text"
						},
						{
							"key": "",
							"value": "",
							"type": "text",
							"disabled": true
						},
						{
							"key": "",
							"value": "",
							"type": "text",
							"disabled": true
						},
						{
							"key": "",
							"value": "",
							"type": "text",
							"disabled": true
						}
					]
				},
				"url": "localhost:8080/forgetPassword"
			},
			"response": []
		},
		{
			"name": "Reset Password",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "urlencoded",
					"urlencoded": [
						{
							"key": "password",
							"value": "pass1",
							"type": "text"
						},
						{
							"key": "",
							"value": "",
							"type": "text",
							"disabled": true
						},
						{
							"key": "",
							"value": "",
							"type": "text",
							"disabled": true
						},
						{
							"key": "",
							"value": "",
							"type": "text",
							"disabled": true
						}
					]
				},
				"url": "http://localhost:8080/resetPassword/69237/gd7mubrgioce5dr"
			},
			"response": []
		},
		{
			"name": "2 factor authication",
			"request": {
				"auth": {
					"type": "noauth"
				},
				"method": "POST",
				"header": [
					{
						"key": "x-access-token",
						"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MzA0ZjJjOWNmYzc0ZGQ2YjU3NDlmNSIsInVzZXJJZCI6NjkyMzcsImlhdCI6MTY4MTA2MTQ2OCwiZXhwIjoxNjgxMDY4NjY4fQ.FMFBdLytCN-BpAX1Q2Yzm59fGN80LgzYG5awM5wZ8Q4",
						"type": "text"
					}
				],
				"body": {
					"mode": "urlencoded",
					"urlencoded": [
						{
							"key": "flag",
							"value": "true",
							"type": "text"
						},
						{
							"key": "",
							"value": "",
							"type": "text",
							"disabled": true
						},
						{
							"key": "",
							"value": "",
							"type": "text",
							"disabled": true
						},
						{
							"key": "",
							"value": "",
							"type": "text",
							"disabled": true
						}
					]
				},
				"url": "http://localhost:8080/user/2fa"
			},
			"response": []
		},
		{
			"name": "Verify otp",
			"request": {
				"auth": {
					"type": "noauth"
				},
				"method": "POST",
				"header": [
					{
						"key": "x-access-token",
						"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MzA0ZjJjOWNmYzc0ZGQ2YjU3NDlmNSIsInVzZXJJZCI6NjkyMzcsImlhdCI6MTY4MDkzODAxNSwiZXhwIjoxNjgwOTQ1MjE1fQ.gyI2zsHsrDxUez2rKg9uTvVSBJ1KLaKpRtt0CpdUaR4",
						"type": "text"
					}
				],
				"body": {
					"mode": "urlencoded",
					"urlencoded": [
						{
							"key": "userId",
							"value": "114440",
							"type": "text"
						},
						{
							"key": "otp",
							"value": "165418",
							"type": "text"
						},
						{
							"key": "",
							"value": "",
							"type": "text",
							"disabled": true
						},
						{
							"key": "",
							"value": "",
							"type": "text",
							"disabled": true
						}
					]
				},
				"url": "http://localhost:8080/verifyOTP"
			},
			"response": []
		},
		{
			"name": "Contact-support",
			"request": {
				"auth": {
					"type": "noauth"
				},
				"method": "POST",
				"header": [
					{
						"key": "x-access-token",
						"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MzA0ZjJjOWNmYzc0ZGQ2YjU3NDlmNSIsInVzZXJJZCI6NjkyMzcsImlhdCI6MTY4MDkzODAxNSwiZXhwIjoxNjgwOTQ1MjE1fQ.gyI2zsHsrDxUez2rKg9uTvVSBJ1KLaKpRtt0CpdUaR4",
						"type": "text"
					}
				],
				"body": {
					"mode": "urlencoded",
					"urlencoded": [
						{
							"key": "firstName",
							"value": "alpha",
							"description": "required",
							"type": "text"
						},
						{
							"key": "lastName",
							"value": "name",
							"description": "required",
							"type": "text"
						},
						{
							"key": "email",
							"value": "alt.zi-6odxao3s@yopmail.com",
							"description": "required",
							"type": "text"
						},
						{
							"key": "message",
							"value": "Hi testing message",
							"description": "required",
							"type": "text"
						},
						{
							"key": "phone",
							"value": "",
							"description": "optional",
							"type": "text"
						}
					]
				},
				"url": "http://localhost:8080/contact-support"
			},
			"response": []
		},
		{
			"name": "Resend otp",
			"request": {
				"auth": {
					"type": "noauth"
				},
				"method": "POST",
				"header": [
					{
						"key": "x-access-token",
						"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MzA0ZjJjOWNmYzc0ZGQ2YjU3NDlmNSIsInVzZXJJZCI6NjkyMzcsImlhdCI6MTY4MDkzODAxNSwiZXhwIjoxNjgwOTQ1MjE1fQ.gyI2zsHsrDxUez2rKg9uTvVSBJ1KLaKpRtt0CpdUaR4",
						"type": "text"
					}
				],
				"body": {
					"mode": "urlencoded",
					"urlencoded": [
						{
							"key": "userId",
							"value": "114440",
							"type": "text"
						},
						{
							"key": "",
							"value": "",
							"type": "text",
							"disabled": true
						},
						{
							"key": "",
							"value": "",
							"type": "text",
							"disabled": true
						},
						{
							"key": "",
							"value": "",
							"type": "text",
							"disabled": true
						}
					]
				},
				"url": "http://localhost:8080/resendOtp"
			},
			"response": []
		}
	]
}
```
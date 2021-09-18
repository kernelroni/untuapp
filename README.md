# untuapp

untu todo app laravel - reactjs

Guest can add todo - Guest = Visitor without login.
User can add his/her own todos after login. User will see and can take action on their own todo only.


## Features and componenet. ( React js part)
```bash
*. Add todo. ( Guest or user todo)
*. Todo will be deleted autometically in 5 Minutes after its created.
*. Save todo ( Complete status check/uncheck will be saved)
*. Delete todo
*. Load all todos
*. Clear all todo
*. React js componenets 
    a. Untoapp - Parent componenet.
    b. Todo input component
    c. Todos component
    d. Header componenet
    e. Loader componenet
    f. Cta Componenet [ Save, Load, Clear buttons]
```
## Laravel parts
1. Routes
2. TodoControllers
3. Task Model

## Installation

Need laravel latest, MySQL and reactjs latest.

Clone the repo first. Go to the project folder then execute the commnads below. 

```bash
* - clone this repo
* - composer install
* - npm install
* - php artisan migrate 
* - npm run dev
* - Add the tasks table into your db.
```

## Dev server

```php
php artisan serve --port=81
```

## User login / Register
http://127.0.0.1:81/ - App view
http://127.0.0.1:81/todo - App view
http://127.0.0.1:81/login - user login 
http://127.0.0.1:81/register - user registration

## Video








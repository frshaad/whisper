# Endpoints

## [POST] `/api/v1/auth/signup`

**Description**: Register a new user.

### Request Body

```ts
{
  username: string;
  fullname: string;
  password: string;
  confirmPassword: string;
}
```

### Successful Response (201 Created)

```json
{
  "success": true,
  "data": SafeUser
}
```

### Possible Errors

#### 1. Invalid Input (Zod)

```json
{
  "success": false,
  "message": "Invalid input",
  "errors": [
    {
      "field": "username",
      "message": "Username must be at least 3 characters long"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    }
    // Can have multiple field errors
  ]
}
```

#### 2. AppError: Username already taken

```json
{
  "success": false,
  "message": "Username is already taken"
}
```

#### 3. Unexpected Server Error (Catch-all)

```json
{
  "success": false,
  "message": "Something went wrong. Please try again later."
}
```

## [POST] `/api/v1/auth/login`

**Description**: log in the user.

### Request Body

```ts
{
  username: string;
  password: string;
}
```

### Successful Response (200)

```json
{
  "success": true,
  "data": SafeUser
}
```

### Possible Errors

#### 1. Invalid Input (Zod)

```json
{
  "success": false,
  "message": "Invalid input",
  "errors": [
    {
      "field": "username",
      "message": "Username must be at least 3 characters long"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    }
    // Can have multiple field errors
  ]
}
```

#### 2. AppError: Username already taken

```json
{
  "success": false,
  "message": "User does not exist" // or "Invalid credentials"
}
```

#### 3. Unexpected Server Error (Catch-all)

```json
{
  "success": false,
  "message": "Something went wrong. Please try again later."
}
```

## [POST] `/api/v1/auth/logout`

**Description**: log out the user.

### Request Body

```ts
{
}
```

### Successful Response (200)

```json
{ "success": true, "message": "User logged out Successfully" }
```

### Possible Errors

#### Unexpected Server Error (Catch-all)

```json
{
  "success": false,
  "message": "Something went wrong. Please try again later."
}
```

## [POST] `/api/v1/auth/change-password`

**Description**: change user's password.

### Request Body

```ts
{
  newPassword: string;
  currentPassword: string;
}
```

### Successful Response (200)

```json
{ "success": true }
```

### Possible Errors

#### 1. Invalid Input (Zod)

```json
{
  "success": false,
  "message": "Invalid input",
  "errors": [
    {
      "field": "",
      "message": ""
    }
    // Can have multiple field errors
  ]
}
```

#### 2. AppError

```json
{
  "success": false,
  "message": "Incorrect password" // or "User not found"
}
```

#### 3. Unexpected Server Error (Catch-all)

```json
{
  "success": false,
  "message": "Something went wrong. Please try again later."
}
```

## [GET] `/api/v1/messages/:userId?cursor=&limit=20`

**Description**: get all messages with the user (userId).

### Request Body

```ts
{
  username: string;
  password: string;
}
```

### Successful Response (200)

```json
{
  "success": true,
  "data": MessageDoc
}
```

### Possible Errors

#### 1. Invalid Input (Zod)

```json
{
  "success": false,
  "message": "Invalid input",
  "errors": [
    {
      "field": "",
      "message": ""
    }
    // Can have multiple field errors
  ]
}
```

#### 2. AppError

```json
{
  "success": false,
  "message": "Invalid ID" // or "Access denied. User not found."
}
```

#### 3. Unexpected Server Error (Catch-all)

```json
{
  "success": false,
  "message": "Something went wrong. Please try again later."
}
```

## [POST] `/api/v1/messages/:receiverId`

**Description**: send message.

### Request Body

```ts
{
  text?: string | undefined;
  image?: string | undefined;
}
```

### Successful Response (201)

```json
{
  "success": true,
  "data": SanitizedMessage
}
```

### Possible Errors

#### 1. Invalid Input (Zod)

```json
{
  "success": false,
  "message": "Invalid input",
  "errors": [
    {
      "field": "",
      "message": ""
    }
    // Can have multiple field errors
  ]
}
```

#### 2. AppError

```json
{
  "success": false,
  "message": "Invalid ID" // or "Access denied. User not found."
}
```

#### 3. Unexpected Server Error (Catch-all)

```json
{
  "success": false,
  "message": "Something went wrong. Please try again later."
}
```

## [DELETE] `/api/v1/messages/:messageId`

**Description**: delete a message of yours.

### Successful Response (200)

```json
{
  "success": true
}
```

### Possible Errors

#### 1. Invalid Input (Zod)

```json
{
  "success": false,
  "message": "Invalid input",
  "errors": [
    {
      "field": "",
      "message": ""
    }
    // Can have multiple field errors
  ]
}
```

#### 2. AppError

```json
{
  "success": false,
  "message": "You only can delete your messages." // or "The message doesn't exist"
}
```

#### 3. Unexpected Server Error (Catch-all)

```json
{
  "success": false,
  "message": "Something went wrong. Please try again later."
}
```

## [GET] `/api/v1/chat`

**Description**: get list of user's chats (for sidebar).

### Successful Response (200)

```json
{
  "success": true,
  "data": ChatListItem[]
}
```

### Possible Errors

#### 1. AppError

```json
{
  "success": false,
  "message": "Access denied. User not found."
}
```

#### 2. Unexpected Server Error (Catch-all)

```json
{
  "success": false,
  "message": "Something went wrong. Please try again later."
}
```

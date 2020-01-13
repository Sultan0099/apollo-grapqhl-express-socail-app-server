import { IUser, IUserValidation } from "../interfaces/user";
import { IPostValidation } from "../interfaces/post";

export const signUpValidator = (
  username: String,
  name: String,
  email: string,
  password: String
) => {
  let errors: IUserValidation = {};

  // check name
  if (username.trim() == "") {
    errors.username = "Please Enter username";
  } else if (username.length < 3 || username.length > 12) {
    errors.username = "username should be between 3 to 12 character long";
  }

  if (name.trim() == "") {
    errors.name = "Please Enter name";
  } else if (name.length < 3 || name.length > 12) {
    errors.name = "Name should be between 3 to 12 character long";
  }

  //  check email
  const emailRegx = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;

  if (email.trim() == "") {
    errors.email = "please Enter email";
  } else if (!emailRegx.test(email)) {
    errors.email = "Email is inCorrect";
  }

  // check password

  if (password.trim() == "") {
    errors.password = "Please Enter password";
  } else if (password.length < 6 || password.length > 15) {
    errors.password = "Password should between 6 to 15 character long";
  }

  // check errors object

  return {
    errors,
    isValid: Object.keys(errors).length < 1
  };
};

export const singInValidator = (email: string, password: string) => {
  let errors: IUserValidation = {};

  //  check email
  const emailRegx = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;

  if (email.trim() == "") {
    errors.email = "please Enter email";
  } else if (!emailRegx.test(email)) {
    errors.email = "Email is inCorrect";
  }

  // check password

  if (password.trim() == "") {
    errors.password = "Please Enter password";
  } else if (password.length < 6 || password.length > 15) {
    errors.password = "Password should between 6 to 15 character long";
  }

  return {
    errors,
    isValid: Object.keys(errors).length < 1
  };
};

export const postValidator = (body: string) => {
  let errors: IPostValidation = {}
  if (body.length < 5 || body.length > 150) {
    errors.body = "Post should consist 5 to 150 character";
  }

  return {
    errors,
    isValid: Object.keys(errors).length < 1
  }
}
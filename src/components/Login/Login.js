import React, { useState, useEffect, useReducer, useContext, useRef } from 'react';
import Input from '../UI/Input/input'
import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../store/auth-context';
const emailReducer = (state, action)=>{
  if (action.type === 'USER_INPUT'){
    return {
      value : action.val,
      isValid : action.val.includes('@')
    }
  }else if(action.type === 'INPUT_BLUR'){
    return {
      value: state.value ,
      isValid :state.value.includes('@')
    }
  }
  return {
    value : '',
    isValid : false
  }
}

const passwordReducer= (state, action)=>{
  if (action.type === 'USER_INPUT'){
    return {
      value : action.val,
      isValid : action.val.trim().length > 6
    }
  }else if(action.type === 'INPUT_BLUR'){
    return {
      value: state.value ,
      isValid :state.value.trim().length > 6
    }
  }
  return {
    value : '',
    isValid : false
  }
}
const Login = (props) => {
  const ctx = useContext(AuthContext);
  // const [enteredEmail, setEnteredEmail] = useState('');
  // // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

 
  const [emailState, dispatchEmail] = useReducer(emailReducer, {value:'', isValid:undefined});
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {value:'', isValid:undefined})
  const {isValid : emailValid} = emailState;
  const {isValid : passwordValid} = passwordState;
  const emailInputRef = useRef();
  const passwordInputRef =useRef();
  useEffect(()=>{
    const identifier = setTimeout(() => {
      setFormIsValid(
        emailValid &&  passwordValid)
    }, 500);
    return ()=>{
      console.log('clean')
      clearTimeout(identifier);
    }
  },[emailValid, passwordValid])

  const emailChangeHandler = (event) => {
    // setEnteredEmail(event.target.value);
    dispatchEmail({type:'USER_INPUT', val:event.target.value})

    // setFormIsValid(
    //   emailState.isValid && passwordState.isValid
    // );
  };

  const passwordChangeHandler = (event) => {
    // setEnteredPassword(event.target.value);
    dispatchPassword({type:'USER_INPUT', val:event.target.value})
    // setFormIsValid(
    //  emailState.isValid && passwordState.isValid
    // );
  };

  const validateEmailHandler = () => {
    dispatchEmail({type:'INPUT_BLUR'})
  };

  const validatePasswordHandler = () => {
    dispatchPassword({type:'INPUT_BLUR'})
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if(formIsValid) {
      ctx.onLogin(emailState.value, passwordState.value);
    }else if(!emailValid) {
      emailInputRef.current.focus();
    }else {
      passwordInputRef.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input 
          ref={emailInputRef}
          label ="E-Mail" 
          id = "email" 
          type ="email" 
          value = {emailState.value} 
          isValid={emailValid}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}/>
        <Input 
          ref={passwordInputRef}
          label ="Password" 
          id = "password" 
          type ="password" 
          value = {passwordState.value} 
          isValid={passwordValid}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}/>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;

import {useState} from 'react';
import FormInput from '../form-input/form-input.component';


import  {createAuthUserWithEmailAndPassword,
    createUserDocumentFromAuth} from 
    '../../utils/firebase/firebase.utils';


import './sign-up-form.styles.scss';
import Button from '../button/button.component';


const defaultFormFields = {
    displayName:'',
    email:'',
    password:'',
    confirmPassword:''

}


const SignUpForm = () => {
    const [formField,setFormFields]= useState(defaultFormFields);
    const {displayName,email,password,confirmPassword} = formField;

    
   
    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    }
    


    const handleSubmit= async(event) => {
        event.preventDefault();

        if(password !== confirmPassword) {
            alert('password do not match');
            return;
        }

        try {
            const {user} = await createAuthUserWithEmailAndPassword(
                email,
                password
            );
           
            
            
           await createUserDocumentFromAuth( user,{displayName});
           resetFormFields();


            
           } catch (error) {
            switch(error.code){
                case 'auth/wrong-password':
                    alert('incorrect password for email');
                    break;

                    case 'auth/user-not-found':
                        alert('no user associate with this email');
                        break;
                        default:
                            console.log(error);
            }
           
        }     
    
    };

  const handleChange = (event) => {
    const {name,value} = event.target;
    setFormFields({...formField,[name]: value});
  };

return(
    <div className='sign-up-container'>
        <h2>Don't have an account? </h2>
        <span>Sign up with your email and password</span>
        <form onSubmit ={handleSubmit}>
            
            <FormInput 
            label="Display Name"
            type='text' required onChange={handleChange} name="displayName" value={displayName}/>

            
            <FormInput
            label="Email"
            type='email' required onChange={handleChange} name="email" value={email} />

            
            <FormInput
            label="Password"
            type='password' required onChange={handleChange} name="password" value={password}/>

            
            <FormInput
            label="Confirm Password"
            type='password' required onChange={handleChange} name="confirmPassword" value={confirmPassword}/>
            <Button type='submit'>Sign Up</Button>
        </form>
    </div>
);
};

export default SignUpForm;
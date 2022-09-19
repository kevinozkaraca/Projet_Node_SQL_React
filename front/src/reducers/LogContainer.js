import { connect } from "react-redux";
import SignUpForm from "../components/SignUpForm";
import SignInForm from "../components/SignInForm";
import { changeIndex, decrement } from "../functions/Log";

const mapStateToProps = (state) => {
  return {
    counter: state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    increment: () => {
      dispatch(changeIndex());
    },
    decrement: () => {
      dispatch(decrement());
    },
  };
};

const mySpecialContainerCreator = connect(mapStateToProps, mapDispatchToProps);

export const SignIn = mySpecialContainerCreator(SignInForm);
export const SignUp = mySpecialContainerCreator(SignUpForm);

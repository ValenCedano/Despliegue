import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { loginFail, loginRequest, loginSucess, logout } from "./userAuthSlice";
import { auth } from "../../firebase/firebaseConfig";

export const actionRegisterWithEmailAndPassword = ({
  email,
  password,
  name,
  photo,
}) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo,
      });
      dispatch(
        loginSucess({
          name: name,
          id: user.uid,
          accessToken: user.accessToken,
          email: email,
          photo: photo,
        })
      );
    } catch (error) {
      console.error(error);
      dispatch(loginFail(error.message));
    }
  };
};

export const actionLoginWithEmailAndPassword = ({ email, password }) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      dispatch(
        loginSucess({
          id: user.uid,
          name: user.displayName,
          photo: user.photoURL,
          email:email,
          accessToken: user.accessToken,
        })
      );
    } catch (error) {
      console.error(error);
      dispatch(loginFail(error.message));
    }
  };
};

export const actionLogout = () => {
  return async (dispatch) => {
    dispatch(loginRequest());
    try {
      await signOut(auth);
      dispatch(logout());
    } catch (error) {
      console.error(error);
      dispatch(loginFail(error.message));
    }
  };
};

export const actionLoginProvider = (provider) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      dispatch(
        loginSucess({
          id: user.uid,
          name: user.displayName,
          photo: user.photoURL,
          email: user.email,
          accessToken: user.accessToken,
        })
      );
    } catch (error) {
      console.error(error);
      dispatch(loginFail(error.message));
    }
  };
};

export const actionLoginPhoneWithCode = (code) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    const confirmationResult = window.confirmationResult;
    console.log(confirmationResult)
    try {
      const response = await confirmationResult.confirm(code);
      const user = response.user;
      dispatch(
        loginSucess({
          id: user.uid,
          name: user.displayName,
          phone:user.phoneNumber,
          photo: user.photoURL,
          accessToken: user.accessToken,
        })
      );
    } catch (error) {
      console.error(error);
      dispatch(loginFail(error.message));
    }
  };
};

export const updateUserProfile = (displayName, photoURL) => {
  return async (dispatch) => {
    // const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        await updateProfile(user, { displayName, photoURL });
        dispatch({ type: "UPDATE_USER_PROFILE_SUCCESS", payload: { displayName, photoURL } });
      } catch (error) {
        dispatch({ type: "UPDATE_USER_PROFILE_ERROR", error });
      }
    }
  };
};
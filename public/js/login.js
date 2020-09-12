
// type is 'success' or 'error'
const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};

const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const stripe = Stripe('pk_test_51H7jI1GSwSZ1GeCZB7CyOVZJYviohUHzWCwbQdsisJcGZspeqgeDSZGTFAXZUaVikwph94lXS44Hj2IVznI5YNTO00dBGNWCUA');

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    alerts.showAlert('error', err);
  }
};

const login = async(email,password) =>{
	try{
	    const res = await axios({
	    	method:'POST',
	    	url: 'http://127.0.0.1:3000/api/v1/users/login',
	    	data: {
	    		email,
	    		password
	    	}
	    });
	     if(res.data.status === "success"){

	     	showAlert('success','logged in successfully')
	     	window.setTimeout(() => {location.assign('/')},1500);
	     }

    }catch(err){
    	
    	showAlert("error",err.response.data.message)
    }

};
//.........................................................................................
const signup = async(name,email,password,passwordConfirm) =>{
  try{
    console.log(passwordConfirm,password,"/////////////////////////////////")
      const res = await axios({
        method:'POST',
        url: 'http://127.0.0.1:3000/api/v1/users/signup',
        data: {
          name,
          email,
          password,
          passwordConfirm
        }
      });
       if(res.data.status === "success"){

        showAlert('success','signup successfull')
        window.setTimeout(() => {location.assign('/')},1500);
       }

    }catch(err){
      
      showAlert("error",err.response.data.message)
    }

};
//.........................................................................................
const logout = async () =>{
	try{
		
	    const res = await axios({
	    	method:'GET',
	    	url: 'http://127.0.0.1:3000/api/v1/users/logout'
	    
	    });
	     if(res.data.status === "success"){
	     	console.log('from logout login')
	     	location.reload(true)
	     }

    }catch(err){
    	
    	showAlert("error",err.response.data.message)
    }

};
//......................................................................................
const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

//..............................................................................................
//..............................................................................................
if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);


//..............................................................................................
//..............................................................................................

if (userDataForm)
  userDataForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn-sukhbir').textContent = 'Updating...';
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);

    await updateSettings(form, 'data');

    document.querySelector('.btn-sukhbir').textContent = 'Save Settings';
    location.reload(true)

  });

//..............................................................................................
//..............................................................................................
if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings({ passwordCurrent, password, passwordConfirm },'password')

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
});

//..............................................................................................
//..............................................................................................

if (signupForm)
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password2').value;

    
    signup(name,email, password,passwordConfirm);
  });

//..............................................................................................
//..............................................................................................

if (bookBtn)
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
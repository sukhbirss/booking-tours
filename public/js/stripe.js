import axios from 'axios';
import alerts from './alerts';
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

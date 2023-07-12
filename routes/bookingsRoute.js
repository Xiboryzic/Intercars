const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const Booking = require("../models/bookingsModel")
const Bus = require("../models/busModel")
const { v4: uuidv4 } = require('uuid');
//const stripe = require("stripe")("sk_test_51N4mT9LyuyIXM3m7m7Z8Q1xf7y7LNbO3wMd3JrV0Q6B466e10hkYcRYJ8muLfMg51hiq8l9KSfRyMjm8eUcMtEn000c9LjB6zh");

const Stripe = require('stripe');
const stripe = Stripe("sk_test_51N4mT9LyuyIXM3m7m7Z8Q1xf7y7LNbO3wMd3JrV0Q6B466e10hkYcRYJ8muLfMg51hiq8l9KSfRyMjm8eUcMtEn000c9LjB6zh");


//book a seat

router.post('/book-seat', authMiddleware, async (req, res) => {
    try {
        const newBooking = new Booking({
            ...req.body,
            user: req.body.userId
        })
        await newBooking.save();
        const bus = await Bus.findById(req.body.bus);
        bus.seatsBooked = [...bus.seatsBooked, ...req.body.seats];
        await bus.save();
        res.status(200).send({
            message: "Booking successful",
            data: newBooking,
            success: true
        })
    } catch (error) {
        res.status(500).send({
            message: "Booking failed (",
            data: error,
            success: false
        })
    }
});

//оплата make payment

router.post('/make-payment', authMiddleware, async (req, res) => {
    try {
        const { token, amount } = req.body;
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        })
        const payment = await stripe.charges.create({
            amount: amount,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email
        }, {
            idempotencyKey: uuidv4(),
        });

        if (payment) {
            res.status(200).send({
                message: "Payment successful",
                data: {
                    transactionId: payment.source.id,
                },
                success: true,
            })
        } else {
            console.log('/////////////////')
            console.log(error)
            res.status(500).send({
                message: "Payment failed",
                data: error,
                success: false
            });
        }

    } catch (error) {
        console.log('/////////////////')
        console.log(error)
        res.status(500).send({
            message: "payment failed",
            data: error,
            success: false
        })
    }
})

// get bookings by user id

router.post('/get-bookings-by-user-id', authMiddleware, async (req, res) => {
    try {
        const booking = await Booking.find({ user: req.body.userId })
            .populate("bus")
            .populate("user");
        res.status(200).send({
            message: "Bookings fetched successfully",
            data: booking,
            success: true,
        })
    } catch (error) {
        res.status(500).send({
            message: "Bookings fetcht failed",
            data: error,
            success: false
        })
    }
});


module.exports = router;
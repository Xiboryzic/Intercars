const router = require('express').Router();
const Bus = require("../models/busModel")
const authMiddleware = require("../middlewares/authMiddleware")


//добавление  add-bus

router.post('/add-bus', async (req, res) => {
    try {
        const existingBus = await Bus.findOne({ number: req.body.number })

        if (existingBus) {
            return res.status(200).send({
                seccess: false,
                meggage: 'Bus already exists',
            })
        }
        const newBus = new Bus(req.body);
        await newBus.save();
        return res.status(200).send({
            success: true,
            message: 'Bus added successfully'
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            meggage: error.message
        })
    }
});

//обновление  update-bus

router.post("/update-bus", authMiddleware, async (req, res) => {
    try {
        await Bus.findByIdAndUpdate(req.body._id, req.body)
        return res.status(200).send({
            success: true,
            message: 'Bus updated successfully',
        })
    }
    catch (error) {
        res.status(500).send({success: false, message: error.meggage})
    }
});

//обновление  delete-bus

router.post("/delete-bus", authMiddleware, async (req, res) => {
    try {
        await Bus.findByIdAndDelete(req.body._id, req.body)
        return res.status(200).send({
            success: true,
            message: 'Bus deleted successfully',
        })
    }
    catch (error) {
        res.status(500).send({success: false, message: error.meggage})
    }
});


//получения списка всех get-all-buses

router.post("/get-all-buses", authMiddleware, async (req, res) => {
    try {
        console.log(req.body.filters)
        const buses = await Bus.find(req.body.filters);
        return res.status(200).send({
            success: true,
            message: "Buses fetched successfully",
            data: buses,
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    };
})


//get-bus-by-id

router.post("/get-bus-by-id", authMiddleware, async (req, res) => {
    try {
        const bus = await Bus.findById(req.body._id);
        return res.status(200).send({
            success: true,
            message: "Buses fetched successfully",
            data: bus,
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    };
})




module.exports = router;
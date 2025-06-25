const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dk7024092@gmail.com',          
        pass: 'erld kpin anjw zrna'              
    }
});


router.post('/register', async (req, res) => {
    const { name, phone, email, password } = req.body;

    try {
        
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already registered" });

    
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const newUser = new User({ name, phone, email, password: hashedPassword });
        await newUser.save();

    
        const mailOptions = {
            from: 'dk7024092@gmail.com',
            to: email,
            subject: 'Welcome to Recipe Book!',
            text: `Hi ${name},\n\nThank you for registering at Recipe Book.\nHappy cooking! 🍽️\n\n– Team Recipe Book`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Email error:", error);
            } else {
                console.log("Email sent:", info.response);
            }
        });

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


router.post('/Login', async (req, res) => {
    const { email, password } = req.body;

    try {
        
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        res.status(200).json({ message: "Login successful", email: user.email });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

const {UserModel , ProdModel ,CategoryModel , PurchaseModel} = require('../modules/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const createCategory = async (req, res) => {
    try {
       
        const Catdata = new CategoryModel(req.body);
        if (!Catdata) {
            return res.status(404).send({ msg: 'Category data not found' });
        }
        await Catdata.save();
        res.status(200).json({ msg: 'Category created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const deleteCategory = async (req, res) => {
    try {
        const category = await CategoryModel.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }
        res.status(200).json({ msg: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const getCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.find();
        if (!categories.length) {
            return res.status(404).json({ msg: 'No categories found' });
        }
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const createItem = async (req, res) => {
    try {
        const { name, img, Description, option, categoryName } = req.body;
        const itemData = new ProdModel({
            name,
            img,
            Description,
            option,
            categoryName
        });
        await itemData.save();
        res.status(200).json({ msg: 'Item created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



const updateItem = async (req, res) => {
    try {
        const item = await ProdModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item) {
            return res.status(404).json({ msg: 'Item not found' });
        }
        res.status(200).json({ msg: 'Item updated successfully', item });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const deleteItem = async (req, res) => {
    try {
        const item = await ProdModel.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ msg: 'Item not found' });
        }
        res.status(200).json({ msg: 'Item deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const getItemsByCategory = async (req, res) => {
    try {
        const items = await ProdModel.find({ categoryName: req.params.categoryId });
        if (!items.length) {
            return res.status(404).json({ msg: 'No items found in this category' });
        }
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getItemById = async (req, res) => {
    try {
        const itemId = req.params.id; 
        console.log('Item ID:', itemId);
        
        const item = await ProdModel.findById(itemId); 
        if (!item) {
            return res.status(404).json({ msg: 'Item not found' });
        }

        res.status(200).json(item);
    } catch (err) {
        console.error("Error in getItemById:", err);
        res.status(500).json({ error: err.message });
    }
};

const createUser = async (req, res) => {
    try {
        const secretKey = process.env.SECRETKEY;
        const { password, ...otherData } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = new UserModel({ ...otherData, password: hashedPassword });
        await userData.save();

        const token = jwt.sign({ id: userData._id, email: userData.email }, secretKey);

        res.status(200).json({ msg: 'User created successfully', token });
    } catch (err) {
        console.error('Error creating user:', err.message);
        res.status(500).json({ error: err.message });
    }
};


const updateUser = async (req, res) => {
    try {
        const { password, ...otherData } = req.body;
        let updatedData = otherData;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updatedData = { ...otherData, password: hashedPassword };
        }

        const user = await UserModel.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(200).json({ msg: 'User updated successfully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await UserModel.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(200).json({ msg: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        if (!users.length) {
            return res.status(404).json({ msg: 'No users found' });
        }
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getUserlogin = async (req, res) => {
    try {
        const { password, email } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: 'Email and password are required' });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'No user found with this email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid email or password' });
        }

        const secretKey = process.env.SECRETKEY;
        const token = jwt.sign({ id: user._id, email: user.email, isAdmin: user.isAdmin }, secretKey);

        res.status(200).json({
            user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
            token
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const checkMail = async (req,res)=>{
    try {
        const { email } = req.params;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(200).json({ exists: true });
        }
        res.status(200).json({ exists: false });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const createPurchase = async (req, res) => {
    try {
        const { userId, items, total, date } = req.body;
        const purchaseDate = date || new Date().toLocaleDateString();
        const newPurchase = new PurchaseModel({ userId, items, total, date:purchaseDate});
        await newPurchase.save();
        res.status(200).json({ msg: 'Purchase saved successfully' });
    } catch (err) {
        console.error('Error in createPurchase:', err.stack)
        res.status(500).json({ error: err.message });
    }
};

const  getPurchaseHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const purchases = await PurchaseModel.find({ userId });
        if (!purchases.length) {
            return res.status(404).json({ msg: 'No purchases found for this user' });
        }
        res.status(200).json(purchases);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    checkMail:checkMail,
    getUserlogin:getUserlogin,
    getUsers:getUsers,
    updateUser:updateUser,
    deleteUser:deleteUser,
    createUser:createUser,
    createItem:createItem,
    updateItem:updateItem,
    deleteItem:deleteItem,
    getItemsByCategory:getItemsByCategory,
    getItemById:getItemById,
    createCategory:createCategory,
    getCategories:getCategories,
    deleteCategory:deleteCategory,
    createPurchase:createPurchase,
    getPurchaseHistory:getPurchaseHistory
}
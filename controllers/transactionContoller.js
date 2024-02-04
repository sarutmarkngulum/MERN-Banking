const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");

// Deposit
exports.deposit = async (req, res) => {
  try {
    const { accountId, amount } = req.body;

    // Update user's balance
    const user = await User.findOne({ accountId: accountId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.balance = Number(user.balance) + Number(amount);
    await user.save();

    // Create transaction record
    const depositTransaction = new Transaction({
      type: "deposit",
      userId: user._id,
      amount: amount,
    });
    await depositTransaction.save();

    // Update user's transactions array
    user.transactions.push(depositTransaction._id);
    await user.save();

    return res.status(201).send({
        success: true,
        message: "Deposit successful!",
        depositTransaction,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
        success: false,
        message: "Deposit fail!",
        error,
      });
  }
};

// Withdraw
exports.withdraw = async (req, res) => {
  try {
    const { accountId, amount } = req.body;

    // Find user by accountId
    const user = await User.findOne({ accountId: accountId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user has sufficient balance
    if (user.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Update user's balance
    user.balance = Number(user.balance) - Number(amount);
    await user.save();

    // Create transaction record
    const withdrawTransaction = new Transaction({
      type: "withdraw",
      userId: user._id,
      amount: amount,
    });
    await withdrawTransaction.save();

    // Update user's transactions array
    user.transactions.push(withdrawTransaction._id);
    await user.save();

    return res.status(201).send({
        success: true,
        message: "Withdraw successful!",
        withdrawTransaction,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
        success: false,
        message: "Withdraw fail!",
        error,
      });;
  }
};

//transfer
exports.transfer = async (req, res) => {
  console.log(req.body);
  try {
    const { fromAccountId, toAccountId, amount } = req.body;
    // Check if fromAccountId and toAccountId are the same
    if (fromAccountId === toAccountId) {
      return res.status(400).json({ error: "Cannot transfer to the same account" });
    }

    // Find sender by fromAccountId
    const sender = await User.findOne({ accountId: fromAccountId });
    if (!sender) {
      return res.status(404).json({ error: "Sender not found" });
    }

    // Check if sender has sufficient balance
    if (sender.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Find receiver by toAccountId
    const receiver = await User.findOne({ accountId: toAccountId });
    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    // Update sender's balance
    sender.balance = Number(sender.balance) - Number(amount);
    await sender.save();

    // Update receiver's balance
    receiver.balance = Number(receiver.balance) + Number(amount);
    await receiver.save();

    // Create transaction record for sender
    const senderTransaction = new Transaction({
      type: "transfer",
      userId: sender._id,
      toUserId: receiver._id,
      amount: amount,
    });
    await senderTransaction.save();

    // Create transaction record for receiver
    const receiverTransaction = new Transaction({
      type: "transfer",
      userId: receiver._id,
      toUserId: sender._id,
      amount: amount,
    });
    await receiverTransaction.save();

    // Update sender's transactions array
    sender.transactions.push(senderTransaction._id);
    await sender.save();

    // Update receiver's transactions array
    receiver.transactions.push(receiverTransaction._id);
    await receiver.save();

    
    return res.status(201).send({
        success: true,
        message: "Transfer successful!",
        senderTransaction,
        receiverTransaction
      });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
        success: false,
        message: "Transfer fail!",
        error,
      });
  }
};

// Get user transactions
exports.getUserTransactions = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find user by userId
    const user = await User.findById(userId).populate('transactions');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const transaction = user.transactions
    return res.status(201).send({
        success: true,
        TransactionCount: transaction.length,
        message: "Get Transactions successful!",
        transaction
      });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
        success: false,
        message: "Get Transactions fail!",
        error,
      });
  }
};

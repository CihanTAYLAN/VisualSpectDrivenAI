const mongoose = require('mongoose');

// Test MongoDB connection
async function testConnection() {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:mongo@192.168.1.13:27017/visual-spect-driven-ai?authSource=admin&directConnection=true';

    console.log('Testing MongoDB connection...');
    console.log('URI:', MONGODB_URI);

    try {
        await mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log('✅ MongoDB connected successfully!');

        // Test creating a simple document
        const TestSchema = new mongoose.Schema({
            name: String,
            createdAt: { type: Date, default: Date.now }
        });

        const TestModel = mongoose.model('Test', TestSchema);

        const testDoc = new TestModel({ name: 'Test Document' });
        await testDoc.save();
        console.log('✅ Document created successfully!');

        // Clean up
        await TestModel.deleteOne({ _id: testDoc._id });
        console.log('✅ Test document cleaned up!');

        await mongoose.disconnect();
        console.log('✅ MongoDB disconnected successfully!');

    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();
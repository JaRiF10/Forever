#!/usr/bin/env node
/**
 * Backend API Test Suite
 * Tests all endpoints for errors and correctness
 * Run: node test-api.js
 */

const http = require('http');
const assert = require('assert');

const BASE_URL = 'http://localhost:5000';
let testToken = null;
let testUserId = null;
let testCapsuleId = null;

// Helper to make HTTP requests
function request(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Connection': 'close'
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = data ? JSON.parse(data) : {};
                    resolve({ status: res.statusCode, body: parsed, headers: res.headers });
                } catch (e) {
                    resolve({ status: res.statusCode, body: data, headers: res.headers });
                }
            });
        });

        req.on('error', reject);
        
        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

// Test suite
async function runTests() {
    console.log('\n🧪 My Sayang Backend API Test Suite\n');

    try {
        // 1. Health Check
        console.log('1️⃣  Testing Health Check...');
        const health = await request('GET', '/api/health');
        assert.strictEqual(health.status, 200, 'Health check failed');
        assert.strictEqual(health.body.status, 'ok', 'Health status not ok');
        console.log('   ✅ Health check passed\n');

        // 2. Register User
        console.log('2️⃣  Testing User Registration...');
        const registerRes = await request('POST', '/api/auth/register', {
            email: `test-${Date.now()}@example.com`,
            password: 'TestPass123',
            name: 'Test User'
        });
        assert.strictEqual(registerRes.status, 201, `Registration failed: ${registerRes.status}`);
        assert(registerRes.body.token, 'No token returned');
        assert(registerRes.body.user, 'No user returned');
        testToken = registerRes.body.token;
        testUserId = registerRes.body.user._id;
        console.log(`   ✅ Registration passed (Token: ${testToken.substring(0, 20)}...)\n`);

        // 3. Login
        console.log('3️⃣  Testing User Login...');
        const loginRes = await request('POST', '/api/auth/login', {
            email: registerRes.body.user.email,
            password: 'TestPass123'
        });
        assert.strictEqual(loginRes.status, 200, 'Login failed');
        assert(loginRes.body.token, 'No token returned on login');
        console.log('   ✅ Login passed\n');

        // 4. Get Current User
        console.log('4️⃣  Testing Get Current User...');
        const meRes = await request('GET', '/api/auth/me', null, testToken);
        assert.strictEqual(meRes.status, 200, 'Get me failed');
        assert.strictEqual(meRes.body.email, registerRes.body.user.email, 'User email mismatch');
        console.log('   ✅ Get current user passed\n');

        // 5. Create Time Capsule
        console.log('5️⃣  Testing Create Time Capsule...');
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        const capsuleRes = await request('POST', '/api/capsules', {
            title: 'Test Capsule',
            content: 'This is a test message for our future',
            unlockAt: futureDate.toISOString()
        }, testToken);
        assert.strictEqual(capsuleRes.status, 201, `Create capsule failed: ${capsuleRes.status}`);
        assert(capsuleRes.body._id, 'No capsule ID returned');
        testCapsuleId = capsuleRes.body._id;
        console.log('   ✅ Create capsule passed\n');

        // 6. List Capsules
        console.log('6️⃣  Testing List Capsules...');
        const listRes = await request('GET', '/api/capsules', null, testToken);
        assert.strictEqual(listRes.status, 200, 'List capsules failed');
        assert(Array.isArray(listRes.body), 'Response is not an array');
        assert(listRes.body.length > 0, 'No capsules in list');
        console.log(`   ✅ List capsules passed (Found ${listRes.body.length} capsule)\n`);

        // 7. Get Specific Capsule (Locked)
        console.log('7️⃣  Testing Get Locked Capsule...');
        const getLockedRes = await request('GET', `/api/capsules/${testCapsuleId}`, null, testToken);
        assert.strictEqual(getLockedRes.status, 200, 'Get capsule failed');
        assert.strictEqual(getLockedRes.body.isLocked, true, 'Capsule should be locked');
        assert.strictEqual(getLockedRes.body.content, undefined, 'Content should not be revealed when locked');
        console.log('   ✅ Get locked capsule passed (Content hidden as expected)\n');

        // 8. Update Capsule
        console.log('8️⃣  Testing Update Capsule...');
        const updateRes = await request('PATCH', `/api/capsules/${testCapsuleId}`, {
            title: 'Updated Capsule Title'
        }, testToken);
        assert.strictEqual(updateRes.status, 200, 'Update capsule failed');
        assert.strictEqual(updateRes.body.title, 'Updated Capsule Title', 'Title not updated');
        console.log('   ✅ Update capsule passed\n');

        // 9. Create Mood Entry
        console.log('9️⃣  Testing Create Mood Entry...');
        const moodRes = await request('POST', '/api/moods', {
            date: new Date().toISOString(),
            mood: 'happy',
            intensity: 5,
            note: 'Test mood entry'
        }, testToken);
        assert.strictEqual(moodRes.status, 201, `Create mood failed: ${moodRes.status}`);
        assert(moodRes.body._id, 'No mood ID returned');
        console.log('   ✅ Create mood entry passed\n');

        // 10. List Moods
        console.log('🔟 Testing List Moods...');
        const modsRes = await request('GET', '/api/moods', null, testToken);
        assert.strictEqual(modsRes.status, 200, 'List moods failed');
        assert(Array.isArray(modsRes.body), 'Moods response is not an array');
        console.log(`   ✅ List moods passed (Found ${modsRes.body.length} mood)\n`);

        // 11. Unauthorized Access Test
        console.log('1️⃣1️⃣  Testing Unauthorized Access...');
        const unauthorizedRes = await request('GET', '/api/capsules');
        assert.strictEqual(unauthorizedRes.status, 401, 'Should reject unauthorized access');
        console.log('   ✅ Unauthorized access properly rejected\n');

        // 12. Delete Capsule
        console.log('1️⃣2️⃣  Testing Delete Capsule...');
        const deleteRes = await request('DELETE', `/api/capsules/${testCapsuleId}`, null, testToken);
        assert.strictEqual(deleteRes.status, 200, 'Delete capsule failed');
        console.log('   ✅ Delete capsule passed\n');

        console.log('\n✅ All tests passed! Backend is working correctly.\n');
        process.exit(0);

    } catch (err) {
        console.error('\n❌ Test failed:', err.message);
        console.error('\nMake sure:');
        console.error('1. Backend server is running: npm dev');
        console.error('2. MongoDB is running (docker run -d -p 27017:27017 mongo:latest)');
        console.error('3. .env file has correct MONGO_URI and JWT_SECRET');
        process.exit(1);
    }
}

// Run tests
runTests();

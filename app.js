const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let tasks = [
    {
        id: 1,
        title: 'Set up environment',
        description: 'Install Node.js, npm, and git',
        completed: true,
        priority: 'high',
        createdAt: new Date().toISOString(),
    },
];

function validateTaskPayload(payload) {
    if (!payload) return false;
    const hasTitle = typeof payload.title === 'string' && payload.title.trim() !== '';
    const hasDescription = typeof payload.description === 'string' && payload.description.trim() !== '';
    const hasCompleted = typeof payload.completed === 'boolean';
    const allowedPriorities = ['low', 'medium', 'high'];
    const hasPriority = payload.priority === undefined || allowedPriorities.includes(payload.priority);
    return hasTitle && hasDescription && hasCompleted && hasPriority;
}

function findTaskIndexById(id) {
    return tasks.findIndex((t) => t.id === id);
}

app.post('/tasks', (req, res) => {
    const payload = req.body;
    if (!validateTaskPayload(payload)) {
        return res.status(400).json({ error: 'Invalid task payload' });
    }
    const newId = tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    const task = {
        id: newId,
        title: payload.title,
        description: payload.description,
        completed: payload.completed,
        priority: payload.priority || 'medium',
        createdAt: new Date().toISOString(),
    };
    tasks.push(task);
    return res.status(201).json(task);
});

app.get('/tasks', (req, res) => {
    let results = tasks.slice();
    if (req.query && typeof req.query.completed !== 'undefined') {
        const q = String(req.query.completed).toLowerCase();
        if (q === 'true' || q === 'false') {
            const b = q === 'true';
            results = results.filter((t) => t.completed === b);
        }
    }
    const sort = req.query && req.query.sort ? String(req.query.sort).toLowerCase() : 'desc';
    results.sort((a, b) => {
        const ta = new Date(a.createdAt).getTime();
        const tb = new Date(b.createdAt).getTime();
        return sort === 'asc' ? ta - tb : tb - ta;
    });
    res.status(200).json(results);
});

app.get('/tasks/priority/:level', (req, res) => {
    const level = String(req.params.level).toLowerCase();
    const allowed = ['low', 'medium', 'high'];
    if (!allowed.includes(level)) return res.status(400).json({ error: 'Invalid priority level' });
    const results = tasks.filter((t) => String(t.priority).toLowerCase() === level);
    return res.status(200).json(results);
});

app.get('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(404).json({ error: 'Not found' });
    const task = tasks.find((t) => t.id === id);
    if (!task) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(task);
});

app.put('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(404).json({ error: 'Not found' });
    const idx = findTaskIndexById(id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    const payload = req.body;
    if (!validateTaskPayload(payload)) return res.status(400).json({ error: 'Invalid task payload' });
    const existing = tasks[idx];
    const updated = {
        id,
        title: payload.title,
        description: payload.description,
        completed: payload.completed,
        priority: payload.priority || existing.priority || 'medium',
        createdAt: existing.createdAt || new Date().toISOString(),
    };
    tasks[idx] = updated;
    return res.status(200).json(updated);
});

app.get('/tasks/priority/:level', (req, res) => {
    const level = String(req.params.level).toLowerCase();
    const allowed = ['low', 'medium', 'high'];
    if (!allowed.includes(level)) return res.status(400).json({ error: 'Invalid priority level' });
    const results = tasks.filter((t) => String(t.priority).toLowerCase() === level);
    return res.status(200).json(results);
});

app.delete('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(404).json({ error: 'Not found' });
    const idx = findTaskIndexById(id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    tasks.splice(idx, 1);
    return res.status(200).json({});
});


app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});


module.exports = app;
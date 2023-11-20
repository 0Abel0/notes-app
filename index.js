const express = require('express')
const Note = require('./models/note')
require('dotenv').config()
const app = express()
const cors = require('cors')
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        if (note) {
            response.json(note)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response) => {
    Note.findByIdAndDelete({_id:request.params.id}).then(note => {
        if (note) {
            response.status(204).end()
        }
        else {
            response.status(404).end()
        }
    })
})

app.post('/api/notes', (request, response) => {
    const body = request.body

    const note = new Note({
        content: body.content,
        important: body.important || false
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    })
})

const errorHandler = (error, request, response, next) => {
	console.error(error.message)
	
	if (error.name === 'CastError') {
		return response.status(400).send({error: 'malformatted id'})
	}
    else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }

	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
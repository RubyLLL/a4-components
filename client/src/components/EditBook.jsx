import React, { Component } from 'react'
import axios from 'axios'
import { Alert } from 'react-bootstrap'

export default class EditBook extends Component {
    constructor(props) {
        super(props);
    
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    
        this.state = {
          owner: '',
          title: '',
          author: '',
          isbn: '',
          hasCopy: '',
          reviews: '',
          users: [],
          error: '',
          message: ''
        }
      }

      componentDidMount() {
          axios.get('/books' + this.props.match.params.id)
          .then(res => {
              if(!res.data.msg) {
                this.setState({
                    owner: res.data.owner,
                    title: res.data.title,
                    author: res.data.author,
                    isbn: res.data.isbn,
                    hasCopy: res.data.hasCopy,
                    reviews: res.data.reviews,
                    message: res.data.message
                })
              }
              else {
                  this.setState({
                      error: res.data.msg
                  })
              }
          })
          .catch(err => console.log(err))
          axios.get('/users/users')
          .then(res => {
              if(res.data.length > 0) {
                  this.setState({
                      users: res.data.map(user => user.name),
                      owner: res.data[0].name
                  })
              }
          })
          .catch(e => console.log(e))
      }

      onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
          })
    }

      onSubmit(e) {
        e.preventDefault()
        const book = {
            title: this.state.title,
            author: this.state.author,
            isbn: this.state.isbn,
            hasCopy: this.state.hasCopy,
            reviews: this.state.reviews,
            owner: this.state.owner
        }
        console.log(book)
        axios.post('/books/update/' + this.props.match.params.id, book)
        .then(res => {
            if(!res.data.msg){
                this.setState({
                    message: 'Book updated successfully!'
                })
            }
            else {
                this.setState({
                    error: res.data.msg
                })
            }
            window.location = '/'
        })
      }
    render() {
        return (
            <div className="container p-5">
                {
                    this.state.error
                    && (<Alert key='alert' variant='warning'>{this.state.error}</Alert>)
                }
                {
                    this.state.message
                    && (<Alert key='success' variant='success'>{this.state.message}</Alert>)
                }
                <h3>Edit Book Log</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group"> 
                        <label>Name: </label>
                        <select 
                        ref="userInput"
                        required
                        className="form-control"
                        name="firstUser"
                        value={this.state.owner}
                        onChange={this.onChange}
                        >
                            {
                            this.state.users.map(function(user) {
                                return <option 
                                    key={user}
                                    value={user}
                                    >
                                        {user}
                                    </option>
                                    })
                            }
                        </select>
                    </div>
                    <div className="form-group">
                       <label htmlFor="title">Title</label>
                       <input 
                       type="text"
                       required
                       className="form-control"
                       name="title"
                       value={this.state.title}
                       onChange={this.onChange} />
                   </div>
                   <div className="form-group">
                       <label htmlFor="author">Author</label>
                       <input 
                       type="text"
                       required
                       className="form-control"
                       name="author"
                       value={this.state.author}
                       onChange={this.onChange} />
                   </div>
                   <div className="form-group">
                       <label htmlFor="isbn">ISBN#</label>
                       <input 
                       type="text"
                       required
                       className="form-control"
                       name="isbn"
                       value={this.state.isbn}
                       onChange={this.onChange} />
                   </div>
                   <div className="form-group">
                       <label for="reviews">Brief Reviews</label>
                        <textarea 
                        rows="3"
                        id="reviews"
                        name="reviews"
                        className="form-control"
                        placeholder="How do you feel about this book?"
                        value={this.state.value}
                        onChange={this.onChange}
                        ></textarea>
                   </div>
                   <div className="form-group">
                       <label className="pr-2">I have a copy of this book. </label>
                       <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="hasCopy" value="Yes" onChange={this.onChange}/>
                            <label className="form-check-label" htmlFor="inlineRadio2">Yes</label>
                       </div>
                       <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="hasCopy" value="No" onChange={this.onChange} />
                            <label className="form-check-label" htmlFor="inlineRadio2">No</label>
                        </div>
                   </div>
                   <button type="submit">Submit</button>
                </form>
            </div>
        )
    }
}

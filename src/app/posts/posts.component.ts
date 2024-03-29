import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { AppError } from '../common/app-error';
import { NotFoundError } from '../common/not-found-error';
import { BadRequestError } from '../common/bad-request-error';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit{

  posts: any[];

  constructor(private service: PostService) {
    
   }

   ngOnInit(){
    this.service.getAll()
    .subscribe(posts => this.posts = posts);
   }

   createPost(input: HTMLInputElement){
     let post = { title: input.value };
     this.posts.splice(0, 0, post);
      
     input.value="";

    this.service.create(post)
    .subscribe(
      newPosts => {
        post['id'] = newPosts.id;
        console.log(newPosts);
      },
      (error: AppError) => {
        this.posts.splice(0, 1);

        if(error instanceof BadRequestError) {
           //this.form.setErrors(error.originalError);
        }
        else{
         throw error;
        }
      });
   }

   updatePost(post){
    this.service.update(post)
    //this.http.put(this.url, JSON.stringify({post}))
      .subscribe(
        updatePosts => {
        console.log(updatePosts);
      });
    }

    deletePost(post){
      let index = this.posts.indexOf(post);
      this.posts.splice(index, 1);

      this.service.delete(post.id)
      .subscribe(
       null,
        (error :AppError) => {
          //this.posts.splice(index, 0, post);

          if(error instanceof NotFoundError){
            alert('This post has already been deleted.')
          }
          else{
            throw error;
          }
      });
    }

}

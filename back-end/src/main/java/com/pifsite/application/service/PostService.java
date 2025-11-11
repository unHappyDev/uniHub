package com.pifsite.application.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.pifsite.application.exceptions.UnauthorizedActionException;
import com.pifsite.application.exceptions.ResourceNotFoundException;
import com.pifsite.application.repository.PostRepository;
import com.pifsite.application.security.UserRoles;
import com.pifsite.application.dto.CreatePostDTO;
import com.pifsite.application.entities.Post;
import com.pifsite.application.entities.User;
import com.pifsite.application.dto.PostDTO;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    public List<PostDTO> getAllPosts() {

        List<PostDTO> posts = this.postRepository.getAllPosts();

        if (posts.isEmpty()) {
            throw new ResourceNotFoundException("there is no posts in the database"); // melhorar depois
        }

        return posts;
    }

    public void createPost(CreatePostDTO postDTO) {

        Authentication userData = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) userData.getPrincipal();

        Post newPost = new Post();
        newPost.setTitle(postDTO.title());
        newPost.setBody(postDTO.body());
        newPost.setOwner(user);

        this.postRepository.save(newPost);
    }

    public void updatePost(CreatePostDTO postDTO, UUID id) {

        Post post = this.postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post with ID " + id + " not found"));


        Authentication userData = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) userData.getPrincipal();

        if (!post.getOwner().equals(user)) {

            throw new UnauthorizedActionException("you can't update a post that is not yours");
        }

        if (postDTO.title() != null && !postDTO.title().isBlank()) {

            post.setTitle(postDTO.title());
        }
        if (postDTO.body() != null && !postDTO.body().isBlank()) {

            post.setBody(postDTO.body());
        }

        this.postRepository.save(post);
    }

    public void deleteOnePost(UUID postId) {

        Post post = this.postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post with ID " + postId + " not found"));

        Authentication userData = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) userData.getPrincipal();

        if (!post.getOwner().equals(user) && !user.getRole().equals(UserRoles.ADMIN)) {

            throw new UnauthorizedActionException("you can't delete a post that is not yours");
        }
        try {
            this.postRepository.deleteById(postId);

        } catch (Exception err) {

            System.out.println(err.getClass());
        }
    }
}

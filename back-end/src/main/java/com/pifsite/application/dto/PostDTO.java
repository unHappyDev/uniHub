package com.pifsite.application.dto;

import com.pifsite.application.entities.User;

import java.time.OffsetDateTime;
import java.util.UUID;

public record PostDTO(UUID postId, String title, String body, OffsetDateTime createdAt, User owner) {}

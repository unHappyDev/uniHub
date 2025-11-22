CREATE Table posts(
    post_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,

    owner UUID NOT NULL,
    CONSTRAINT fk_owner FOREIGN KEY (owner) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_owner ON posts(owner);
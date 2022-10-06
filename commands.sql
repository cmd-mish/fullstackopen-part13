CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

insert into blogs (author, url, title) values ('Test author 1', 'http://example.com/', 'Test title 1');

insert into blogs (url, title, likes) values ('http://example.com/', 'Test title 2', 2);
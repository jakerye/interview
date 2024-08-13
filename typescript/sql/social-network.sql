----------
-- The following questions will ask about SQL and relational databases.
--
-- Rules:
-- * Please write answers in SQL - do not use Active Record or ORM syntax.
-- * Pseudo-sql and Schema outlines are acceptable
--   the SQL does not have to compile.
----------


----------
-- Social Network
----------
--
----------
-- 1. Friendships
----------
-- Suppose we are building a simple social network.
-- There are users, and users can be friends with other users.
--
-- Design a schema for this setup.
--
-- What row or rows would you store in the Friendships 
-- table if User 1 is friends with User 2?


-- CREATE USERS TABLE
create table users (
    id uuid primary key,
    name varchar(200)
);
create index idx_users_id on users (id);
create index idx_users_name on users (name);

-- CREATE FRIENDSHIPS TABLE
create table friendships (
    user1 uuid not null,
    user2 uuid not null,
    foreign key (user1) references users (id) on delete cascade,
    foreign key (user2) references users (id) on delete cascade
);
create index idx_friendships_user1 on friendships (user1);
create index idx_friendships_user2 on friendships (user2);

----------
-- 2. Statuses
----------
--
-- Suppose we want to support statuses.
-- Users can post statuses, and all the friends of 
-- a user can view that user's statuses.
-- A status consists of a simple string, and a 
-- user can post many statuses over time
--
-- How would you add to your schema to support this?
--

-- CREATE STATUSES TABLE
create table statuses (
    id serial primary key,
    user_id uuid references users (id),
    body varchar(250),
    posted_at date
);
create index idx_statuses_user_id on statuses (user_id);


-- SEED USERS
insert into users (id, name) values
('35eb81f1-4855-4bca-a786-1adb3f9af4f0', 'User A'),
('12345678-1234-5678-1234-567812345678', 'User B'),
('87654321-4321-8765-4321-876543218765', 'User C');

-- SEED FRIENDSHIPS (TODO: should be pairwise transactional)
insert into friendships (user1, user2) values
(
    '35eb81f1-4855-4bca-a786-1adb3f9af4f0',
    '12345678-1234-5678-1234-567812345678'
),
(
    '12345678-1234-5678-1234-567812345678',
    '35eb81f1-4855-4bca-a786-1adb3f9af4f0'
),
(
    '35eb81f1-4855-4bca-a786-1adb3f9af4f0',
    '87654321-4321-8765-4321-876543218765'
),
(
    '87654321-4321-8765-4321-876543218765',
    '35eb81f1-4855-4bca-a786-1adb3f9af4f0'
);

-- SEED STATUSES
insert into statuses (user_id, body, posted_at) values
(
    '35eb81f1-4855-4bca-a786-1adb3f9af4f0',
    'First status from User A',
    '2024-07-12'
),
(
    '12345678-1234-5678-1234-567812345678',
    'First status from User B',
    '2024-07-11'
),
(
    '87654321-4321-8765-4321-876543218765',
    'First status from User C',
    '2024-07-10'
),
(
    '35eb81f1-4855-4bca-a786-1adb3f9af4f0',
    'Second status from User A',
    '2024-07-09'
);


----------
-- 3. Querying
----------
--
-- What would the query look like to fetch a specific user's timeline?
-- A timeline is all the statuses the specific user's 
-- friends have posted, with most recent statuses coming first.
-- A time line is NOT the statuses a user has posted themselves
--

-- QUERY USER FEED
select
    statuses.body,
    statuses.posted_at,
    users.name
from statuses
inner join friendships on statuses.user_id = friendships.user1
inner join users on statuses.user_id = users.id
where friendships.user2 = '35eb81f1-4855-4bca-a786-1adb3f9af4f0'
order by statuses.posted_at desc
limit 100;


----------
-- 4. Friends
----------
--
-- Suppose we want to support friend requests.
-- To be friends with someone (and view their statuses),
-- you must first request permission, and they must approve you.
--
-- How would you modify your schema and the query to support this?


-- CREATE FRIEND REQUESTS TABLE
-- TODO: Prevent duplicate friend requests here -- or in application logic
create type friend_request_status as enum ('pending', 'approved', 'rejected');
create table friend_requests (
    id serial primary key,
    requester_id uuid not null references users (id) on delete cascade,
    requested_id uuid not null references users (id) on delete cascade,
    status friend_request_status not null
);
create index idx_friend_requests_requester_id on friend_requests (requester_id);
create index idx_friend_requests_requested_id on friend_requests (requested_id);


-- SEED FRIEND REQUESTS
insert into friend_requests (requester_id, requested_id, status) values
(
    '35eb81f1-4855-4bca-a786-1adb3f9af4f0',
    '12345678-1234-5678-1234-567812345678',
    'approved'
),
(
    '87654321-4321-8765-4321-876543218765',
    '35eb81f1-4855-4bca-a786-1adb3f9af4f0',
    'pending'
),
(
    '12345678-1234-5678-1234-567812345678',
    '87654321-4321-8765-4321-876543218765',
    'approved'
);

-- QUERY FRIEND REQUESTS
select
    fr.id as request_id,
    u1.name as requester_name,
    u2.name as requested_name,
    fr.status
from
    friend_requests as fr
inner join
    users as u1 on fr.requester_id = u1.id
inner join
    users as u2 on fr.requested_id = u2.id
limit 5;

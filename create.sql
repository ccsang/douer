create table if not exists user_info (
    id int primary key not null auto_increment,
    email varchar(128) not null,
    password varchar(128) not null,
    nickname varchar(128) not null,
    sex int not null default 0,
    birthday date,
    city varchar(128),
    status int not null default 1,
    hometown varchar(128),
    school varchar(128),
    private_set int not null default 1,
    photo varchar(128),
    intro varchar(128),
    register_time timestamp not null default CURRENT_TIMESTAMP
)DEFAULT CHARSET=utf8;

create table if not exists friends (
    id int primary key not null auto_increment,
    user_id int not null,
    friend_id int not null,
    group_id int,
    comment varchar(128) 
)DEFAULT CHARSET=utf8;

create table if not exists friends_group (
    id int primary key not null auto_increment,
    user_id int not null,
    group_name varchar(128) not null
)DEFAULT CHARSET=utf8;

create table if not exists add_friend_msg (
    id int primary key not null auto_increment,
    user_id int not null,
    send_user_id int not null,
    send_time timestamp not null default CURRENT_TIMESTAMP,
    status int not null default 1,
    content varchar(255)
)DEFAULT CHARSET=utf8;

create table if not exists short_messages (
    id int primary key not null auto_increment,
    send_user_id int not null,
    receive_user_id int not null,
    send_time timestamp not null default CURRENT_TIMESTAMP,
    content varchar(255) not null,
    status int not null default 1
)DEFAULT CHARSET=utf8;

create table if not exists visit_record (
    id int primary key not null auto_increment,
    user_id int not null,
    friend_id int not null,
    time timestamp not null default CURRENT_TIMESTAMP
)DEFAULT CHARSET=utf8;

create table if not exists blog (
    id int primary key not null auto_increment,
    user_id int not null,
    category_id int not null,
    title varchar(128) not null,
    content text not null,
    post_time timestamp not null default CURRENT_TIMESTAMP,
    update_time timestamp not null 
)DEFAULT CHARSET=utf8;

create table if not exists category (
    id int primary key not null auto_increment,
    user_id int not null,
    category_name varchar(128) not null   
)DEFAULT CHARSET=utf8;

create table if not exists photo (
    id int primary key not null auto_increment,
    user_id int not null,
    album_id int not null,
    path varchar(128) not null,
    comment varchar(128)
)DEFAULT CHARSET=utf8;

create table if not exists album (
    id int primary key not null auto_increment,
    user_id int not null,
    cover varchar(128) not null,
    album_name varchar(128) not null
)DEFAULT CHARSET=utf8;

create table if not exists message (
    id int primary key not null auto_increment,
    user_id int not null,
    poster_id int not null,
    content varchar(128) not null,
    post_time timestamp not null default CURRENT_TIMESTAMP
)DEFAULT CHARSET=utf8;

create table if not exists broadcast (
    id int primary key not null auto_increment,
    user_id int not null,
    content varchar(255) not null,
    post_time timestamp not null default CURRENT_TIMESTAMP 
)DEFAULT CHARSET=utf8;

create table if not exists share (
    id int primary key not null auto_increment,
    user_id int not null,
    content varchar(255)
)DEFAULT CHARSET=utf8;

create table if not exists review (
    id int primary key not null auto_increment,
    type int not null,
    review_id int not null,
    user_id int not null,
    content varchar(255),
    review_time timestamp not null default CURRENT_TIMESTAMP
)DEFAULT CHARSET=utf8;

create table if not exists review_type (
    id int primary key not null auto_increment,
    name varchar(128) not null 
)DEFAULT CHARSET=utf8;

create table if not exists feed (
    id int primary key not null auto_increment,
    user_id int not null,
    msg_type int not null,
    event_msg varchar(255) not null,
    create_time timestamp not null default CURRENT_TIMESTAMP 
)DEFAULT CHARSET=utf8;



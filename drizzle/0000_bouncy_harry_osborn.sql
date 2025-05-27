CREATE TABLE `books`
(
    `id`             int AUTO_INCREMENT NOT NULL,
    `title`          varchar(255) NOT NULL,
    `author`         varchar(255) NOT NULL,
    `isbn`           varchar(255) NOT NULL,
    `published_date` timestamp,
    `created_at`     timestamp DEFAULT (now()),
    `updated_at`     timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `books_id_pk` PRIMARY KEY (`id`),
    CONSTRAINT `books_isbn_unique` UNIQUE (`isbn`),
    CONSTRAINT `isbn_idx` UNIQUE (`isbn`)
);
--> statement-breakpoint
CREATE TABLE `inventory`
(
    `id`          int AUTO_INCREMENT NOT NULL,
    `book_id`     int NOT NULL,
    `location_id` int NOT NULL,
    `created_at`  timestamp DEFAULT (now()),
    `updated_at`  timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `inventory_id_pk` PRIMARY KEY (`id`)
);
--> statement-breakpoint
CREATE TABLE `locations`
(
    `id`         int AUTO_INCREMENT NOT NULL,
    `name`       varchar(255) NOT NULL,
    `address`    varchar(255) NOT NULL,
    `created_at` timestamp DEFAULT (now()),
    `updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `locations_id_pk` PRIMARY KEY (`id`)
);
--> statement-breakpoint
CREATE TABLE `rentals`
(
    `id`           int AUTO_INCREMENT NOT NULL,
    `user_id`      int       NOT NULL,
    `inventory_id` int       NOT NULL,
    `rental_date`  timestamp NOT NULL DEFAULT (now()),
    `created_at`   timestamp          DEFAULT (now()),
    `updated_at`   timestamp          DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `rentals_id_pk` PRIMARY KEY (`id`)
);
--> statement-breakpoint
CREATE TABLE `session`
(
    `id`         varchar(255) NOT NULL,
    `user_id`    int          NOT NULL,
    `expires_at` datetime     NOT NULL,
    CONSTRAINT `session_id` PRIMARY KEY (`id`)
);
--> statement-breakpoint
CREATE TABLE `user`
(
    `id`            int AUTO_INCREMENT NOT NULL,
    `username`      varchar(255) NOT NULL,
    `password_hash` varchar(255) NOT NULL,
    CONSTRAINT `user_id` PRIMARY KEY (`id`)
);
--> statement-breakpoint
ALTER TABLE `session`
    ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `username_idx` ON `user` (`username`);

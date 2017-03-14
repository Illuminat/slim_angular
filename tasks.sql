--
-- Table structure for `tasks`
--
CREATE TABLE `slim`.`tasks` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `type` VARCHAR(45) NOT NULL DEFAULT 'info',
  `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`));

INSERT INTO `tasks` (`id`, `title`, `type`, `created`) VALUES
(0, 'Find bugs', 'warning', '2017-03-01 23:50:40'),
(1, 'Find bugs', 'danger', '2017-03-01 23:50:40'),
(2, 'Fix bugs', 'info', '2017-03-11 23:50:40'),
(3, 'Refactor Code', 'info', '2017-03-12 23:50:40');
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: hungrymap
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `category` varchar(100) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favoritelist`
--

DROP TABLE IF EXISTS `favoritelist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favoritelist` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `listId` int NOT NULL,
  `email` varchar(100) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk5_idx` (`email`),
  KEY `fk6_idx` (`listId`),
  CONSTRAINT `fk5` FOREIGN KEY (`email`) REFERENCES `member` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk6` FOREIGN KEY (`listId`) REFERENCES `placelist` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoritelist`
--

LOCK TABLES `favoritelist` WRITE;
/*!40000 ALTER TABLE `favoritelist` DISABLE KEYS */;
INSERT INTO `favoritelist` VALUES (6,300,'vksek@gmail.com'),(7,300,'tndnjsthd@gmail.com'),(8,300,'zkwpsxn@gmail.com'),(9,300,'skskf@gmail.com'),(10,301,'vksek@gmail.com'),(11,301,'tndnjsthd@gmail.com'),(12,301,'zkwpsxn@gmail.com'),(13,301,'skskf@gmail.com'),(14,302,'ehowl@gmail.com'),(15,302,'tndnjsthd@gmail.com'),(16,302,'zkwpsxn@gmail.com'),(17,302,'skskf@gmail.com'),(18,304,'ehowl@gmail.com'),(19,304,'vksek@gmail.com'),(20,304,'tndnjsthd@gmail.com'),(21,304,'skskf@gmail.com'),(22,306,'ehowl@gmail.com'),(23,306,'vksek@gmail.com'),(24,306,'zkwpsxn@gmail.com'),(25,306,'skskf@gmail.com'),(26,308,'ehowl@gmail.com'),(27,308,'vksek@gmail.com'),(28,308,'tndnjsthd@gmail.com'),(29,308,'zkwpsxn@gmail.com'),(30,200,'jota@gmail.com'),(31,200,'eunsun@gmail.com'),(32,200,'hyunjin@gmail.com'),(33,200,'hungry@gmail.com'),(34,201,'jota@gmail.com'),(35,201,'hyunjin@gmail.com'),(36,202,'joha@gmail.com'),(37,202,'eunsun@gmail.com'),(38,202,'hungry@gmail.com'),(39,203,'joha@gmail.com'),(40,203,'eunsun@gmail.com'),(41,204,'joha@gmail.com'),(42,205,'hungry@gmail.com'),(43,206,'hyunjin@gmail.com'),(44,207,'hungry@gmail.com'),(45,208,'hyunjin@gmail.com'),(46,209,'hyunjin@gmail.com'),(47,204,'da970901@gmail.com');
/*!40000 ALTER TABLE `favoritelist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `matpli_view`
--

DROP TABLE IF EXISTS `matpli_view`;
/*!50001 DROP VIEW IF EXISTS `matpli_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `matpli_view` AS SELECT 
 1 AS `writer`,
 1 AS `writernickname`,
 1 AS `id`,
 1 AS `listname`,
 1 AS `image`,
 1 AS `favcount`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `email` varchar(100) NOT NULL,
  `nickname` varchar(50) NOT NULL,
  `pwd` varchar(500) DEFAULT NULL,
  `provider` varchar(30) DEFAULT 'local',
  `last_login_time` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES ('da970901@gmail.com','luvme ifyou','$2a$10$UytmaNULp8tvAIi9BIKyiOEarTd1PWun6VgtW5hEkljYww/iNyRXe','google','2024-08-25 22:06:49.945122'),('ehowl@gmail.com','채음','$2a$10$vyEj6jvFy2gIvFV4QxrzQOaUTeUb5fdprqXWgUoN7pABDm6PA3LTG','',NULL),('eunsun@gmail.com','조하엄마','$2a$10$vyEj6jvFy2gIvFV4QxrzQOaUTeUb5fdprqXWgUoN7pABDm6PA3LTG','','2024-08-26 11:04:03.466858'),('highschoolghost01@gmail.com','망령','$2a$10$vyEj6jvFy2gIvFV4QxrzQOaUTeUb5fdprqXWgUoN7pABDm6PA3LTG','',NULL),('hungry@gmail.com','미식가','$2a$10$vyEj6jvFy2gIvFV4QxrzQOaUTeUb5fdprqXWgUoN7pABDm6PA3LTG','',NULL),('hyunjin@gmail.com','조하아빠','$2a$10$vyEj6jvFy2gIvFV4QxrzQOaUTeUb5fdprqXWgUoN7pABDm6PA3LTG','',NULL),('joha@gmail.com','조하','$2a$10$vyEj6jvFy2gIvFV4QxrzQOaUTeUb5fdprqXWgUoN7pABDm6PA3LTG','','2024-08-26 17:05:51.857061'),('jota@gmail.com','조타','$2a$10$vyEj6jvFy2gIvFV4QxrzQOaUTeUb5fdprqXWgUoN7pABDm6PA3LTG','','2024-08-26 15:32:46.031568'),('matchiveadmin@gmail.com','맛카이브','$2a$10$EVuV4fXjzsq5k0PRpEsEVOVaMO3a32Y0NjxLXvEOwKvzqdMAv7oqm',NULL,'2024-08-26 10:49:39.506377'),('maybethistime@gmail.com','성인돼지','$2a$10$vyEj6jvFy2gIvFV4QxrzQOaUTeUb5fdprqXWgUoN7pABDm6PA3LTG','',NULL),('rhaehfdlWkd@gmail.com','곰돌이짱','$2a$10$vyEj6jvFy2gIvFV4QxrzQOaUTeUb5fdprqXWgUoN7pABDm6PA3LTG','',NULL),('skskf@gmail.com','나날','$2a$10$vyEj6jvFy2gIvFV4QxrzQOaUTeUb5fdprqXWgUoN7pABDm6PA3LTG','',NULL),('test@test.test','test','$2a$10$Jke9EoXZgnYWbCzTZici9O7ieAppGJ/w4ySp7CxseGF2YqnoMLTYW',NULL,'2024-08-26 13:07:39.827364'),('test2@test.test','테스트2','$2a$10$H/PnA.JcRqufvxB8/dXN2eMyUTY7MJCljUIVL5f/XFrRIcmHPM9fa',NULL,'2024-08-26 10:10:11.174493'),('test3@test.test','테스트3','$2a$10$jqMyMNytxUuZQBEFayxaTe1qEEGbJ9SVWmnarRCBcz7y7K2CuPEAe',NULL,'2023-08-25 10:12:04.318949'),('tndnjsthd@gmail.com','알트','$2a$10$vyEj6jvFy2gIvFV4QxrzQOaUTeUb5fdprqXWgUoN7pABDm6PA3LTG','',NULL),('unijjang4187@naver.com','Yunho','$2a$10$vZL7C4naw30q4SqikTD7kuEQHOr/FNywheKDx02EYECSRBRc7IRU.','kakao',NULL),('unijk4187@gmail.com','유니장','$2a$10$gCiLxoqj26XPXKQ8WDu1A.kWn.5Q/lr0aif7kEZZ.Dj0IbU7c6N/6',NULL,'2024-08-26 17:09:57.341655'),('vksek@gmail.com','서폿','$2a$10$vyEj6jvFy2gIvFV4QxrzQOaUTeUb5fdprqXWgUoN7pABDm6PA3LTG','',NULL),('vldkshcjswo@gmail.com','엄마난커서임윤찬이될','$2a$10$vyEj6jvFy2gIvFV4QxrzQOaUTeUb5fdprqXWgUoN7pABDm6PA3LTG','','2024-08-26 11:06:16.773131'),('yuno@naver.com','유노','$2a$10$QQCbnpaJtcaNGss67nky3uj4N.Fac3rFe9EazBcPs66f1x9r6XP0e',NULL,'2024-08-26 11:50:16.530779'),('zkwpsxn@gmail.com','찬만','$2a$10$vyEj6jvFy2gIvFV4QxrzQOaUTeUb5fdprqXWgUoN7pABDm6PA3LTG','',NULL),('zpdlzmwhgdk@gmail.com','디저트헌터','$2a$10$vyEj6jvFy2gIvFV4QxrzQOaUTeUb5fdprqXWgUoN7pABDm6PA3LTG','',NULL);
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_userrolelist`
--

DROP TABLE IF EXISTS `member_userrolelist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_userrolelist` (
  `member_email` varchar(100) NOT NULL,
  `userRoleList` tinyint DEFAULT NULL,
  KEY `FKqne80dch4o80u7vu8cc1rxn61` (`member_email`),
  CONSTRAINT `FKqne80dch4o80u7vu8cc1rxn61` FOREIGN KEY (`member_email`) REFERENCES `member` (`email`) ON DELETE CASCADE,
  CONSTRAINT `member_userrolelist_chk_1` CHECK ((`userRoleList` between 0 and 3))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_userrolelist`
--

LOCK TABLES `member_userrolelist` WRITE;
/*!40000 ALTER TABLE `member_userrolelist` DISABLE KEYS */;
INSERT INTO `member_userrolelist` VALUES ('test@test.test',0),('da970901@gmail.com',0),('da970901@gmail.com',1),('ehowl@gmail.com',0),('vksek@gmail.com',0),('tndnjsthd@gmail.com',0),('zkwpsxn@gmail.com',0),('skskf@gmail.com',0),('jota@gmail.com',0),('eunsun@gmail.com',0),('hyunjin@gmail.com',0),('hungry@gmail.com',0),('rhaehfdlWkd@gmail.com',0),('vldkshcjswo@gmail.com',0),('zpdlzmwhgdk@gmail.com',0),('highschoolghost01@gmail.com',0),('maybethistime@gmail.com',0),('joha@gmail.com',0),('joha@gmail.com',1),('test2@test.test',0),('matchiveadmin@gmail.com',0),('matchiveadmin@gmail.com',1),('unijjang4187@naver.com',0),('test3@test.test',2),('yuno@naver.com',0),('unijk4187@gmail.com',0);
/*!40000 ALTER TABLE `member_userrolelist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `place`
--

DROP TABLE IF EXISTS `place`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `place` (
  `ID` varchar(50) NOT NULL,
  `y` varchar(100) NOT NULL,
  `x` varchar(100) NOT NULL,
  `pname` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `reviewcount` int NOT NULL DEFAULT '0',
  `avgrates` float DEFAULT NULL,
  `categoryname` varchar(500) DEFAULT NULL,
  `image` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `place`
--

LOCK TABLES `place` WRITE;
/*!40000 ALTER TABLE `place` DISABLE KEYS */;
INSERT INTO `place` VALUES ('10375994','37.4784417105451','126.981381752608','라시에스타','서울 동작구 사당동 1031-27',0,NULL,'음식점 > 양식 > 이탈리안','http://t1.daumcdn.net/localfiy/A29F86E8B0164BE1A2119151E5750A08'),('1062422741','37.56210983071858','126.98927021026016','루프트 명동점','서울 중구 충무로2가 50-10',1,4,'음식점 > 카페','http://t1.kakaocdn.net/mystore/E541A25FA83243D7AB42ECDD1797EB08'),('10785087','35.53583382563003','129.33817286381102','구룡','울산 남구 달동 1301-8',1,4,'음식점 > 중식 > 중국요리','http://t1.kakaocdn.net/fiy_reboot/place/8BD63BCE9FF046F3B9A580F4431CA56B'),('1086947915','37.51311711356294','126.94648794001702','스타벅스 노량진동점','서울 동작구 노량진동 333',3,4.3333,'음식점 > 카페 > 커피전문점 > 스타벅스','http://t1.daumcdn.net/place/F0E33AB636A348038DF0E58DFBCBAD75'),('1102847581','37.5600817964388','126.973026854861','해담채 시청점','서울 중구 봉래동1가 25',0,NULL,'음식점 > 한식 > 한정식','http://t1.kakaocdn.net/mystore/59029FD1DDA04670AF48F1C2C9FDB21A'),('11047820','37.4843416817038','126.982456677092','개화','서울 서초구 방배동 438-24',0,NULL,'음식점 > 중식 > 중국요리','http://t1.daumcdn.net/place/D6B77F2F4E314E318E20B52354804DD1'),('1123468090','37.5483562687906','126.920967220812','해피베어데이 상수점','서울 마포구 상수동 316-2',0,NULL,'음식점 > 카페 > 테마카페 > 디저트카페','http://t1.daumcdn.net/place/524AF2A63C5149D3B93D3B532AC05C79'),('1163493593','37.5387206069177','126.987201821415','후럼브르클린','서울 용산구 이태원동 656',0,NULL,'음식점 > 양식 > 피자','http://t1.daumcdn.net/place/BD8CEA51AE6B429DA304765E06EDA17D'),('1189986226','37.5643099882007','126.976366603681','배스킨라빈스 시청역점','서울 중구 서소문동 12-1',1,4,'음식점 > 간식 > 아이스크림 > 배스킨라빈스','http://t1.daumcdn.net/place/DDC34CC90CB94C1A8BF1D060DA110CE4'),('1191541006','37.5582447114973','126.919621282655','장작집 연남본점','서울 마포구 연남동 570-38',0,NULL,'음식점 > 치킨','http://t1.kakaocdn.net/mystore/08E5C2DB07664779B0D05A4315C2A2DB'),('129475538','37.5148053040577','127.107976658518','등촌샤브칼국수 방이본점','서울 송파구 방이동 24-7',1,5,'음식점 > 샤브샤브 > 등촌샤브칼국수','http://t1.daumcdn.net/place/534692DFD226465EA82C65DA632E09C5'),('1345579330','37.5651805373127','126.990569169023','배떡 충무로점','서울 중구 저동2가 7-2',0,NULL,'음식점 > 분식 > 떡볶이','http://t1.daumcdn.net/place/D35DB0E16B3C490FADC0BFFAD8DC7FCD'),('13602705','37.53989485538652','126.89531717022082','전주집','서울 영등포구 양평동5가 107-1',0,NULL,'음식점 > 한식','http://t1.daumcdn.net/place/F508E9327ADE4711A1D17393AE5D6416'),('1429706639','37.53273489990985','127.005994105826','김종용누룽지통닭 한남점','서울 용산구 한남동 632-4',0,NULL,'음식점 > 치킨','http://t1.daumcdn.net/localfiy/245F82E497DB49BF9B4D823B875706F2'),('1441250513','36.77498549845324','126.98212230944735','화담원 신정호점','충남 아산시 방축동 727',0,NULL,'음식점 > 샤브샤브','http://t1.daumcdn.net/localfiy/56426C0476BB47C5A70920FD2D5BBECA'),('14751744','37.5344640287278','126.95861278811509','땅끝마을','서울 용산구 원효로3가 40-1',0,NULL,'음식점 > 한식 > 국밥','http://t1.kakaocdn.net/fiy_reboot/place/02568B589DB34271B5E0B01D10FA9716'),('15200301','37.53078973084522','126.99625293262865','민들레','서울 용산구 이태원동 20-65',0,NULL,'음식점 > 한식 > 국밥','http://t1.daumcdn.net/cfile/164440425007C23D30'),('15444947','37.579285396334','126.97366216588188','디미','서울 종로구 통의동 1-1',0,NULL,'음식점 > 양식 > 이탈리안','http://t1.daumcdn.net/cfile/2666034054FD5A3F02'),('15450268','37.4928950164823','126.991111997844','차이797 블랙 서래마을점','서울 서초구 방배동 810-2',0,NULL,'음식점 > 중식 > 중국요리','http://t1.daumcdn.net/place/F55E412E34184E18A1593A46BB38DBE0'),('159263842','35.155103375458076','129.11703741984095','구슬소 구슬아이스크림 광안리 본점','부산 수영구 광안동 1330',0,NULL,'음식점 > 간식 > 아이스크림','http://t1.kakaocdn.net/fiy_reboot/place/D85F416363104798A490BEBFBDFDB5B9'),('16036536','37.57105310832544','126.98918176572872','순천가','서울 종로구 낙원동 206',3,5,'음식점 > 한식 > 육류,고기','http://t1.daumcdn.net/cfile/19746B374F69608C10'),('16065669','37.520118521620674','127.03188286540531','다모아분식','서울 강남구 논현동 61-18',0,NULL,'음식점 > 분식 > 떡볶이','http://t1.daumcdn.net/place/F3FFE5E46C474201976811A53FBFA34E'),('161224806','37.4834609737697','126.975089588053','이태리상회','서울 동작구 사당동 323-3',0,NULL,'음식점 > 양식 > 이탈리안','http://t1.kakaocdn.net/mystore/83450F27CE0A484F838A34FE8571DF6C'),('1617441630','35.15339512615334','129.12545607470412','아포가토디젤라또','부산 수영구 민락동 181-169',0,NULL,'음식점 > 간식 > 아이스크림','http://t1.kakaocdn.net/mystore/7C18667579274B4BA77FF7E75DFC4610'),('1623916036','35.541031670878716','129.33610017584377','혁이네','울산 남구 삼산동 1574-7',1,5,'음식점 > 일식 > 초밥,롤','http://t1.daumcdn.net/place/7CB3E64C39C54FB78BE44DEF413635F3'),('16527363','37.61264008518267','127.0315372393518','원조할매곱창 미아점','서울 강북구 미아동 55-46',1,5,'음식점 > 한식 > 육류,고기 > 곱창,막창','http://t1.daumcdn.net/place/0D771B79ED504405966A78D15B091CC2'),('16655244','36.8127677669025','127.141240329945','닭발만 본점','충남 천안시 서북구 성정동 733-4',0,NULL,'음식점 > 한식 > 육류,고기 > 닭요리','http://t1.daumcdn.net/cfile/1427A9394F72CE682A'),('1720807249','35.15854946084184','129.1708852947505','호랑이젤라떡','부산 해운대구 중동 957-2',0,NULL,'음식점 > 간식 > 아이스크림','http://t1.kakaocdn.net/fiy_reboot/place/88B2F02286BE44EDBC70262FD5F16EE4'),('174518667','37.5891073101517','127.009827869682','램브로양꼬치 동소문점','서울 성북구 동소문동2가 287',0,NULL,'음식점 > 중식 > 양꼬치','http://t1.daumcdn.net/local/kakaomapPhoto/review/1b4a9e812dd0c7d7a900580cb710e7a8573b3937?original'),('1746397370','37.5069760639586','126.958134851629','스타벅스 중앙대점','서울 동작구 흑석동 205-5',1,5,'음식점 > 카페 > 커피전문점 > 스타벅스','http://t1.daumcdn.net/place/CB50A78305234D14875FC1959A29E91F'),('1772290573','37.5729073734134','126.989370541135','초이다이닝','서울 종로구 익선동 166-60',1,5,'음식점 > 일식','http://t1.daumcdn.net/place/FFDA00D4F82D47718B3818661525B948'),('1778521365','37.5644014717436','126.984776361563','보승회관 명동점','서울 중구 명동1가 34-1',0,NULL,'음식점 > 한식 > 국밥','http://t1.daumcdn.net/place/B4161AFA6CD8422BB3740F5BAA59AAA0'),('17884762','37.52108554442141','126.9690443188777','스타벅스 동부이촌동점','서울 용산구 이촌동 302-60',0,NULL,'음식점 > 카페 > 커피전문점 > 스타벅스','http://t1.daumcdn.net/cfile/241C5D4A55E006C21D'),('180676940','37.568708602313606','126.9879833865063','오카구라','서울 종로구 관철동 33-3',0,NULL,'음식점 > 일식 > 일본식라면','http://t1.daumcdn.net/localfiy/A7D554FB7D7546A1A5F8B86201138629'),('1822111964','37.564430335182415','126.98502310323119','하동관 명동본점','서울 중구 명동1가 10-9',0,NULL,'음식점 > 한식 > 곰탕','http://t1.daumcdn.net/place/4B16B23F578C4B86A8B4E36217D9C516'),('1832429583','37.4825309294943','126.768763130018','멍마르뜨 부천애견동반식당','경기 부천시 소사구 송내동 382-2',0,NULL,'음식점 > 술집 > 호프,요리주점','http://t1.kakaocdn.net/mystore/0A9D53D052B0491E84B51C86BB8B6CA9'),('184125380','37.5040640333231','127.006740506765','모던눌랑 센트럴시티점','서울 서초구 반포동 118-3',0,NULL,'음식점 > 중식 > 중국요리','http://t1.kakaocdn.net/mystore/A1389236F4864FB98D67A9B9D83F6A2B'),('1863813515','37.52183839440251','126.9257067545357','을지다락 여의도','서울 영등포구 여의도동 35-3',1,5,'음식점 > 양식','http://t1.kakaocdn.net/mystore/B6EF7EBBC2164287B76791EFFE9857CB'),('19157195','37.57040783343064','126.98593256813055','써브웨이 종로점','서울 종로구 종로2가 12',0,NULL,'음식점 > 패스트푸드 > 샌드위치 > 써브웨이','http://t1.daumcdn.net/place/0676B5E4EB8048D39CCA8B5AA0F81473'),('19382069','37.5558796368221','126.923761463926','홍대조폭떡볶이 홍대2호점','서울 마포구 동교동 164-17',0,NULL,'음식점 > 분식 > 떡볶이','http://t1.daumcdn.net/place/F16C981646684708A4F5133A5E776BA8'),('1944729440','37.5482766202559','126.921778679952','카페스윗피','서울 마포구 상수동 313-6',0,NULL,'음식점 > 카페 > 테마카페 > 디저트카페','http://t1.kakaocdn.net/mystore/FC07468333D44AB786AAA90B25F2FF41'),('196328375','35.5433553118924','129.339268849922','구룡성훠궈앤마라탕','울산 남구 삼산동 1550-19',1,4,'음식점 > 중식 > 중국요리','http://t1.kakaocdn.net/fiy_reboot/place/10F631DFF8324024A06D2DD7C90F3900'),('1969790364','37.56875705133095','126.98611681802281','미도갈비 종로직영점','서울 종로구 관철동 11-13',2,4.5,'음식점 > 한식 > 육류,고기 > 갈비','http://t1.kakaocdn.net/mystore/8A1C59B66E0B43B58F8D6FC476788B27'),('1990677632','37.57369126609973','126.98967607231562','자연도소금빵&자연도가','서울 종로구 익선동 166-51',3,5,'음식점 > 간식 > 제과,베이커리','http://t1.daumcdn.net/place/2163BFB826264A47BF6FFFD8B7D922A1'),('20125427','37.52463536000364','127.03762597221736','루비떡볶이','서울 강남구 신사동 653-2',0,NULL,'음식점 > 분식 > 떡볶이','http://t1.kakaocdn.net/fiy_reboot/place/2139FC4620E340EA9F85C07939AAE782'),('2015927992','37.39658898603678','127.11361503470188','기욤 판교아브뉴프랑점','경기 성남시 분당구 삼평동 740',0,NULL,'음식점 > 카페 > 테마카페 > 디저트카페','http://t1.kakaocdn.net/fiy_reboot/place/03DFAF4E9DB44B54A69B9BA3D24D24EE'),('2029288865','37.5183656988847','126.931278962704','스타벅스 샛강역점','서울 영등포구 여의도동 55-2',1,5,'음식점 > 카페 > 커피전문점 > 스타벅스','http://t1.daumcdn.net/place/7B311470C27C49CF86BEFA629FAC6B61'),('20308398','35.54351548328154','129.324656886406','함경면옥','울산 남구 신정동 133-6',0,NULL,'음식점 > 한식 > 냉면','http://t1.kakaocdn.net/fiy_reboot/place/77965EC974434A529EEC38906B983D09'),('2040655168','37.57294615707315','126.98983465493978','창화당 익선동점','서울 종로구 익선동 174',0,NULL,'음식점 > 분식','http://t1.daumcdn.net/place/3876E9AD878C4C3CAE6B961E251F93BE'),('21359554','37.56838240474039','126.93047690875805','목란','서울 서대문구 연희동 132-28',0,NULL,'음식점 > 중식','http://t1.daumcdn.net/place/D278098914D445818DE92EF22C3CD136'),('21408033','37.5724910086314','126.98826124869743','소문난국밥전문','서울 종로구 낙원동 241-12',0,NULL,'음식점 > 한식 > 국밥','http://t1.daumcdn.net/local/kakaomapPhoto/review/832acc3ab3631e60b0ebbac9c5f5fbfd22db0bfe?original'),('2143988257','37.56855522765132','126.98611119582282','진중 우육면관','서울 종로구 관철동 11-11',1,5,'음식점 > 중식','http://t1.daumcdn.net/localfiy/searchregister_752892657'),('22425621','37.5054023669512','126.9419412623547','이전희의 행복한생과자','서울 동작구 상도동 536',1,5,'음식점 > 간식',''),('229590009','35.154216337229315','129.12703222862365','허니홈비 밀락더마켓','부산 수영구 민락동 113-31',0,NULL,'음식점 > 간식 > 아이스크림','http://t1.daumcdn.net/place/29F734543D954667BC4B2160105B6799'),('23283453','37.48748955826478','126.98086955825545','파스타&피자','서울 동작구 사당동 139-46',0,NULL,'음식점 > 양식 > 이탈리안','/api/images/noimages.png'),('23991500','37.573014457988016','126.93696235428352','유우','서울 서대문구 연희동 75-18',5,4.8,'음식점 > 일식','http://t1.kakaocdn.net/mystore/5EEA7C3228FB49E890557C5DEAB09328'),('24612345','37.4875885449975','126.98011761148','팬쿡 이수점','서울 동작구 사당동 130-22',0,NULL,'음식점 > 양식 > 스테이크,립','http://t1.daumcdn.net/place/602DC84B4EAC43A8A247E29C70C6D390'),('25036918','37.56327523942241','127.01512154258373','마복림떡볶이','서울 중구 신당동 292-112',0,NULL,'음식점 > 분식 > 떡볶이','http://t1.daumcdn.net/place/0EADF330E0AD4D9980C78F236BEB5807'),('26086942','37.655893293316','127.063766068781','털보고된이 본점','서울 노원구 상계동 332-3',0,NULL,'음식점 > 한식 > 해물,생선','http://t1.daumcdn.net/place/A4313424391046E89FBF965507A2C757'),('26493763','37.4874733406702','126.980872954513','이즈키친','서울 동작구 사당동 139-46',0,NULL,'음식점 > 양식 > 이탈리안','http://t1.daumcdn.net/place/82DE4E331FFB4700BC8BF5C3FAA172D4'),('26533982','37.5332260434997','126.99642478319613','이드','서울 용산구 이태원동 137-14',0,NULL,'음식점 > 한식','http://t1.daumcdn.net/localfiy/5DEF5A84A4C243B19EA05E9FDBDEB6F4'),('26856753','37.5190688966562','127.024094217652','브루클린더버거조인트 가로수길점','서울 강남구 신사동 540-11',0,NULL,'음식점 > 양식 > 햄버거','http://t1.daumcdn.net/cfile/21114447558E18D80A'),('268986384','37.5693244251463','126.984107512976','우성닭갈비 종로점','서울 종로구 관철동 43-14',0,NULL,'음식점 > 한식 > 육류,고기 > 닭요리','http://t1.daumcdn.net/place/6DB994A56C13448E8911F846DA69C2F7'),('27281065','37.49685945677163','127.03046619859454','반장즉석떡볶이 강남점','서울 강남구 역삼동 827-1',0,NULL,'음식점 > 분식 > 떡볶이','http://t1.daumcdn.net/place/9854020ECF814862A9C5B20028F965E8'),('27281774','37.56428887762199','126.98501407661176','신세계떡볶이','서울 중구 명동1가 26-1',0,NULL,'음식점 > 분식 > 떡볶이','http://t1.daumcdn.net/place/D75DA2D08C3A48F2B6990C8BDCFA8FC8'),('27315486','37.50934634160341','127.05931611229317','사이드쇼','서울 강남구 삼성동 159-6',0,NULL,'음식점 > 분식 > 떡볶이','http://t1.daumcdn.net/place/9D97BD0C025F4ACEA6FB5E559EA97D07'),('27352120','37.57270365296705','126.93703393190755','고미정','서울 서대문구 연희동 79-3',0,NULL,'음식점 > 한식 > 한정식','http://t1.daumcdn.net/cfile/24405448568CC7CA0D'),('27504403','37.4957969888219','127.027533517545','일일향 강남3호점','서울 서초구 서초동 1327-2',0,NULL,'음식점 > 중식 > 중국요리','/api/images/noimages.png'),('27506479','37.57259119981057','126.98245410910964','교대이층집 광화문점','서울 종로구 견지동 110',0,NULL,'음식점 > 한식 > 육류,고기 > 삼겹살','http://t1.daumcdn.net/localfiy/8A112B5A61D54C459CC3144CEA70FDB4'),('27510661','37.5343950097517','126.988224228724','지노스 피자','서울 용산구 이태원동 457-3',0,NULL,'음식점 > 양식 > 피자','http://t1.daumcdn.net/place/7C65933F5B1A4AB8AD75C862BDD20B5D'),('27531028','37.508273597184','127.065472540919','중앙해장','서울 강남구 대치동 996-16',0,NULL,'음식점 > 한식 > 해장국','http://t1.daumcdn.net/cfile/2342553556E27E461C'),('27540102','37.571717650682224','126.97944890786793','청진옥','서울 종로구 청진동 183-1',0,NULL,'음식점 > 한식 > 해장국','http://t1.kakaocdn.net/mystore/E6FB1C92C10E4A84AEF1C8118173939F'),('27549051','37.5340855260102','126.994533023467','텅앤그루브조인트','서울 용산구 이태원동 127-15',0,NULL,'음식점 > 한식 > 육류,고기','http://t1.daumcdn.net/place/4F7614D15FA04F9381655733B64C8D97'),('340761651','37.50204173101859','127.02400958019028','메이탄 강남점','서울 서초구 서초동 1309-1',0,NULL,'음식점 > 중식 > 중국요리','http://t1.kakaocdn.net/fiy_reboot/place/84470E68AC4945FFBC8E5B93BF612C4C'),('378913911','37.56374441420448','126.99142050809589','을지다락','서울 중구 초동 156-9',0,NULL,'음식점 > 양식','http://t1.kakaocdn.net/mystore/71A07BB9B29A408DA8AF526C373F6DD3'),('407516557','37.57412557748366','126.99004731366884','우즈베이커리 익선점','서울 종로구 익선동 126-2',0,NULL,'음식점 > 간식 > 제과,베이커리','http://t1.kakaocdn.net/fiy_reboot/place/608D5C3D02554862BD195BED535D6318'),('416934208','37.571894277369','126.985782300881','엄용백돼지국밥 종각점','서울 종로구 인사동 194-28',0,NULL,'음식점 > 한식 > 국밥','http://t1.daumcdn.net/localad_thumb/t/6c4564ef9dc42c5e5ebd01b782be890f499154d3'),('432578365','37.5031934221037','126.948458342683','스타벅스 상도역점','서울 동작구 상도1동 666-5',2,5,'음식점 > 카페 > 커피전문점 > 스타벅스','http://t1.kakaocdn.net/fiy_reboot/place/7665B67E40074151A971AFD106D280C5'),('440189321','35.5370195493472','129.334829583278','심해','울산 남구 달동 1260-9',1,5,'음식점 > 일식','http://t1.daumcdn.net/place/5CA8E997BAEF47859ECA2B5414FDA60E'),('445481007','37.6757194173014','127.496106829499','테이스티','경기 가평군 설악면 신천리 151-18',0,NULL,'음식점 > 양식 > 이탈리안','http://t1.kakaocdn.net/mystore/27EBB4D3CF5144878FC6E28D335932DF'),('465241131','37.49003910335314','126.97060060364666','파로','서울 동작구 사당동 175-26',0,NULL,'음식점 > 양식 > 이탈리안','http://t1.kakaocdn.net/mystore/BF24B318646D4B058F04AAE69CF3F76D'),('487293560','37.55904885167308','126.98007487131405','라밥 회현점','서울 중구 회현동1가 94-4',5,4.6,'음식점 > 분식','http://t1.daumcdn.net/place/5BD173C1325C49289A4335F6C90D84D2'),('525622050','37.50020359704819','126.93187915489521','스타벅스 신대방삼거리역점','서울 동작구 상도동 320-21',0,NULL,'음식점 > 카페 > 커피전문점 > 스타벅스','http://t1.daumcdn.net/place/8049C0B1AD9445AD926557F924C653F6'),('537017155','37.3825996946715','127.093004234372','카페두레브','경기 성남시 분당구 백현동 500-15',0,NULL,'음식점 > 카페 > 테마카페 > 디저트카페','http://t1.daumcdn.net/localfiy/searchregister_136203471'),('576866836','37.5731831182537','126.989828962722','한옥랑솜','서울 종로구 익선동 166-40',0,NULL,'음식점 > 카페','http://t1.daumcdn.net/place/4C80E44C9E5A480492AD3A0425825A68'),('66183033','37.5133910456679','126.940875235694','스타벅스 노량진역점','서울 동작구 노량진동 62-8',1,5,'음식점 > 카페 > 커피전문점 > 스타벅스','http://t1.daumcdn.net/place/FD9202B6877D4FDAAD7F5DA8F3B85637'),('661872026','37.56176541908733','126.92449341926384','해피치즈스마일 연남점','서울 마포구 연남동 228-59',0,NULL,'음식점 > 분식 > 떡볶이','http://t1.kakaocdn.net/mystore/027078DD96C04DFEA8C0873020F34D94'),('67327276','37.5729722755335','126.989714659524','담솥 익선직영점','서울 종로구 익선동 166-44',1,5,'음식점 > 한식','http://t1.daumcdn.net/place/DFC521021FFB4A38BD61BAC8A7FDD824'),('747631489','37.5564167586585','126.912266884549','도카','서울 마포구 서교동 473-8',0,NULL,'음식점 > 카페 > 테마카페 > 디저트카페','http://t1.daumcdn.net/place/C14C878B535D49CDA23A0970BF3ECCC0'),('776808601','36.7642284488405','126.97486272947','코쿠미 신정호수점','충남 아산시 기산동 12-9',0,NULL,'음식점 > 양식','http://t1.daumcdn.net/local/kakaomapPhoto/review/0b0ba689cbdda0705d0f8949c765901383eb1c23?original'),('7818113','37.56839334531018','126.98891841085968','대련집','서울 종로구 관수동 163',3,5,'음식점 > 한식 > 국수 > 칼국수','http://t1.daumcdn.net/place/091F44943FB54A3E9227D2FD2AC0247A'),('787431047','36.87353896710646','127.12016749709312','양당어죽국수 본점','충남 천안시 서북구 직산읍 자은가리 89-9',1,5,'음식점 > 한식 > 국수','http://t1.daumcdn.net/place/09BBC55D2B8B4BB5851BD97A15B8F33E'),('788384095','37.5738742211348','126.990302049906','라미스콘 익선점','서울 종로구 익선동 152',0,NULL,'음식점 > 카페 > 테마카페 > 디저트카페','http://t1.kakaocdn.net/fiy_reboot/place/00877FE215434BFFB624783FA9442BE1'),('7912905','37.56213783919516','126.98240562832072','산동교자','서울 중구 명동2가 105',1,5,'음식점 > 중식 > 중국요리','http://t1.daumcdn.net/place/7E16D8AD3F5440FD9E646A7702C22E25'),('7997827','37.5722618958552','126.98588637389','양반댁','서울 종로구 인사동 193-5',0,NULL,'음식점 > 한식 > 한정식','http://t1.daumcdn.net/place/24AFADECCF86431094EA2625CCB8241C'),('8000172','36.7757450290872','126.976328628914','연춘식당','충남 아산시 득산동 15-1',0,NULL,'음식점 > 한식 > 해물,생선 > 장어','http://t1.daumcdn.net/place/3F1E78133629455CAB161AA505D04C99'),('8016538','37.56652476574594','126.9898728803471','오구반점','서울 중구 을지로3가 5-9',1,4,'음식점 > 중식 > 중국요리','http://t1.kakaocdn.net/fiy_reboot/place/591F571340DC4CD184A92653B3BA3E2A'),('810727645','35.1554389322126','129.116863971736','젤라또조이','부산 수영구 광안동 152-48',0,NULL,'음식점 > 간식 > 아이스크림','http://t1.daumcdn.net/place/6292FF31964A46DB91AD467A72A115B2'),('815913780','37.573073210516405','126.98998858970526','고운돈','서울 종로구 익선동 171-1',0,NULL,'음식점 > 한식 > 육류,고기','http://t1.daumcdn.net/place/5AB6462C0EFA4F1084EA5C4170B39142'),('8264239','37.55823655256039','126.97301846582216','동강나루터','서울 중구 남대문로5가 6-10',0,NULL,'음식점 > 한식 > 해물,생선 > 매운탕,해물탕','http://t1.daumcdn.net/place/CDF2238C273547B588285A5DBD8D89E6'),('83108266','37.52560341079871','127.03643182404942','롸카두들 내쉬빌 핫치킨 압구정점','서울 강남구 신사동 646-8',0,NULL,'음식점 > 양식 > 햄버거','http://t1.kakaocdn.net/mystore/7BA1F10F7C4F483DB11D2D4054C9CF12'),('8341060','37.49402454243176','127.02823622824069','삼성각','서울 서초구 서초동 1330-18',0,NULL,'음식점 > 중식 > 중국요리','http://t1.daumcdn.net/cfile/17143F455007AD6806'),('835373645','37.5732867682917','126.9902511859268','빠리가옥','서울 종로구 익선동 166-26',0,NULL,'음식점 > 양식','http://t1.daumcdn.net/localfiy/8EFFAC207E6F4F12A01AEA23ED1386AD'),('8381402','37.5717965569434','126.982689747565','백부장집닭한마리 본관','서울 종로구 공평동 129',0,NULL,'음식점 > 한식 > 육류,고기 > 닭요리','http://t1.daumcdn.net/place/76B46E3B000249ECA97DCE66B1324AF4'),('8388698','35.53854717643802','129.3496042056059','삼산밀면전문점','울산 남구 삼산동 1645-1',1,5,'음식점 > 한식 > 국수','http://t1.kakaocdn.net/fiy_reboot/place/98AD5EC1262E49FCA1AFAE04D5D6AB18'),('838900659','37.555516460941945','126.930964191624','디퍼','서울 마포구 동교동 188-2',0,NULL,'음식점 > 양식 > 피자','http://t1.daumcdn.net/place/1883806606634E25B4E0E90AC9A085E6'),('8513154','37.5726042317651','126.985537655396','얼큰한조벡이수제비칼국수','서울 종로구 인사동 190-2',0,NULL,'음식점 > 한식 > 수제비','http://t1.daumcdn.net/localfiy/105430975B504F11908E03F383297AED'),('8577709','37.5674786354639','126.980440498664','초류향','서울 중구 다동 164-2',1,5,'음식점 > 중식 > 중국요리','http://t1.daumcdn.net/localfiy/D445145C790347C48091C93A8247EA13'),('859839051','37.5691664686737','126.989681224641','비사벌전주콩나물국밥 종로점','서울 종로구 관수동 144',1,5,'음식점 > 한식 > 국밥','http://t1.daumcdn.net/place/BEADEA097BCD47C2929A2D8151B45034'),('861091174','35.61350356964063','129.4549451789287','라메르판지','울산 북구 구유동 327-1',1,5,'음식점 > 카페','http://t1.kakaocdn.net/mystore/7A8510AC028E43358D67F16DE2E44813'),('861775066','37.39983173753569','127.09639336296024','수하담','경기 성남시 분당구 판교동 511-5',0,NULL,'음식점 > 카페 > 테마카페 > 디저트카페','http://t1.kakaocdn.net/mystore/667BD073CE2547F59F319171D546646D'),('8670706','37.55989344806759','126.97710366926631','희락갈치','서울 중구 남창동 34-34',0,NULL,'음식점 > 한식 > 해물,생선','http://t1.kakaocdn.net/fiy_reboot/place/B4F1A3A07EC6474F8A34581191B35E90'),('86870950','37.4117451770581','127.143345542796','카페지지','경기 성남시 분당구 야탑동 219-3',0,NULL,'음식점 > 카페 > 테마카페 > 디저트카페','http://t1.daumcdn.net/place/1B37EBE4CE074240831DC7FDDF7D073B'),('9410327','37.56213061005416','126.9822641506879','일품향','서울 중구 명동2가 105',0,NULL,'음식점 > 중식 > 중국요리','http://t1.daumcdn.net/local/kakaomapPhoto/review/0a56db2d845f48daa832c4d3e4447a6065cb9ee3?original'),('957680682','37.5239396305844','126.898062403218','양평서울해장국','서울 영등포구 당산동3가 29',0,NULL,'음식점 > 한식 > 해장국','http://t1.kakaocdn.net/fiy_reboot/place/0A4BCDDD192143A6B0D5F4C40E717959'),('998165263','37.5708723429479','126.984164914388','종각밥상','서울 종로구 공평동 80',0,NULL,'음식점 > 한식 > 찌개,전골','http://t1.daumcdn.net/place/74EBD09E9EAB438E9F0D3CBA66A81063');
/*!40000 ALTER TABLE `place` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `placeimages`
--

DROP TABLE IF EXISTS `placeimages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `placeimages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `address1` varchar(100) NOT NULL,
  `placeid` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `placeimages`
--

LOCK TABLES `placeimages` WRITE;
/*!40000 ALTER TABLE `placeimages` DISABLE KEYS */;
/*!40000 ALTER TABLE `placeimages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `placelist`
--

DROP TABLE IF EXISTS `placelist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `placelist` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `listName` varchar(100) NOT NULL,
  `writer` varchar(100) NOT NULL,
  `image` varchar(100) NOT NULL,
  `favcount` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  KEY `fk15_idx` (`writer`),
  CONSTRAINT `fk15` FOREIGN KEY (`writer`) REFERENCES `member` (`email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=321 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `placelist`
--

LOCK TABLES `placelist` WRITE;
/*!40000 ALTER TABLE `placelist` DISABLE KEYS */;
INSERT INTO `placelist` VALUES (200,'반려견 동반 맛집','joha@gmail.com','121340473_01.jpg',4),(201,'분위기 좋은 양식집','joha@gmail.com','121335473_02.jpg',12),(202,'떡볶이 맛집','jota@gmail.com','190527853_03.jpg',3),(203,'내 인생 국밥','jota@gmail.com','190527853_05.jpg',2),(204,'빵지순례','jota@gmail.com','190527853_04.jpg',16),(205,'내사랑 닭발','eunsun@gmail.com','190527853_06.jpg',12),(206,'종각 맛집','eunsun@gmail.com','190527853_07.jpg',83),(207,'일단 눌러보세요','hyunjin@gmail.com','190527853.jpg',1),(208,'천안 추천 맛집','hungry@gmail.com','121332473.jpg',1),(209,'성북구 맛집','hungry@gmail.com','121327473.jpg',1),(300,'돈가스맛집','ehowl@gmail.com','2461237.jpg',4),(301,'인생한식','ehowl@gmail.com','289789797.jpg',4),(302,'분식이제일좋아','vksek@gmail.com','2123132131.jpg',4),(303,'국밥한사발해','vksek@gmail.com','2456476786.jpg',0),(304,'사당 양식','tndnjsthd@gmail.com','23154647888.jpg',4),(305,'배고프다','tndnjsthd@gmail.com','24564654777.jpg',0),(306,'중식저장소','zkwpsxn@gmail.com','26545649811.jpg',4),(307,'비빔밥킬러','zkwpsxn@gmail.com','28978979855.jpg',0),(308,'디저트배는 따로잇음','skskf@gmail.com','231234564999.jpg',4),(309,'아이스크림','skskf@gmail.com','231234654111.jpg',0),(310,'점심 뭐먹어유','da970901@gmail.com','20200921_5f68cae63695a1724511111740.jpg',5),(311,'성인돼지파티','maybethistime@gmail.com','images1724512073163.jfif',0),(315,'테스트','yuno@naver.com','2023-10-221724640573201.jpg',0),(316,'울산 데이트 코스','unijk4187@gmail.com','관람차1724644505751.png',0),(317,'샤브샤브!','jota@gmail.com','판지1724654035257.jpg',0),(318,'나만 가고 싶은 곳','unijk4187@gmail.com','kimminji1724655311999.jpg',0),(319,'300일 기념','unijk4187@gmail.com','ggolzzanggu1724655366041.png',0),(320,'회식 장소','joha@gmail.com','ggolzzanggu1724659621559.png',0);
/*!40000 ALTER TABLE `placelist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `placestorage`
--

DROP TABLE IF EXISTS `placestorage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `placestorage` (
  `listId` int NOT NULL,
  `placeId` varchar(50) NOT NULL,
  `ID` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`ID`),
  KEY `fk1_idx` (`listId`),
  KEY `fk192841_idx` (`placeId`),
  CONSTRAINT `fk1` FOREIGN KEY (`listId`) REFERENCES `placelist` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk18` FOREIGN KEY (`placeId`) REFERENCES `place` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=140 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `placestorage`
--

LOCK TABLES `placestorage` WRITE;
/*!40000 ALTER TABLE `placestorage` DISABLE KEYS */;
INSERT INTO `placestorage` VALUES (300,'487293560',19),(301,'1822111964',20),(301,'7818113',21),(301,'1969790364',22),(301,'8381402',23),(301,'7997827',24),(302,'27281774',25),(302,'27281065',26),(302,'20125427',27),(302,'16065669',28),(302,'27315486',29),(302,'19382069',30),(302,'661872026',31),(303,'859839051',32),(303,'1778521365',33),(303,'14751744',34),(303,'15200301',35),(303,'21408033',36),(304,'10375994',37),(304,'161224806',38),(304,'26493763',39),(304,'465241131',40),(304,'23283453',41),(304,'24612345',42),(305,'7818113',43),(305,'1863813515',44),(305,'26086942',45),(306,'11047820',46),(306,'340761651',47),(306,'27504403',48),(306,'184125380',49),(306,'8341060',50),(306,'15450268',51),(306,'9410327',52),(307,'27549051',53),(307,'26533982',54),(307,'13602705',55),(308,'861775066',56),(308,'537017155',57),(308,'86870950',58),(308,'2015927992',59),(308,'1123468090',60),(308,'1944729440',61),(308,'747631489',62),(308,'1617441630',63),(309,'229590009',64),(309,'810727645',65),(309,'159263842',66),(309,'1720807249',67),(300,'8670706',68),(300,'1102847581',69),(300,'8264239',70),(306,'8577709',71),(306,'7912905',72),(306,'8016538',73),(308,'1062422741',74),(308,'1189986226',75),(200,'8000172',76),(200,'1832429583',77),(200,'445481007',78),(201,'776808601',79),(201,'378913911',80),(202,'25036918',81),(202,'1345579330',82),(202,'2040655168',83),(203,'416934208',84),(203,'957680682',85),(204,'1990677632',86),(204,'407516557',87),(204,'788384095',88),(204,'576866836',89),(205,'16655244',90),(206,'16036536',91),(206,'835373645',92),(206,'815913780',93),(207,'23991500',94),(207,'27352120',95),(207,'21359554',96),(208,'1441250513',97),(208,'787431047',98),(209,'174518667',99),(310,'835373645',106),(310,'407516557',107),(310,'19157195',108),(310,'998165263',109),(310,'180676940',110),(310,'8513154',111),(311,'1163493593',112),(311,'27510661',113),(311,'838900659',114),(311,'1191541006',115),(311,'1429706639',116),(206,'27506479',118),(206,'268986384',119),(206,'2143988257',120),(206,'27540102',121),(206,'1969790364',122),(316,'196328375',128),(316,'861091174',129),(316,'8388698',130),(316,'1623916036',131),(316,'20308398',132),(203,'23991500',133),(317,'23991500',134),(319,'23991500',135),(318,'26856753',136),(318,'15444947',137),(319,'27531028',138),(320,'1969790364',139);
/*!40000 ALTER TABLE `placestorage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `content` varchar(1000) NOT NULL,
  `writedate` datetime DEFAULT CURRENT_TIMESTAMP,
  `rates` int NOT NULL,
  `writer` varchar(100) NOT NULL,
  `placeId` varchar(50) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk7_idx` (`writer`),
  KEY `fk8_idx` (`placeId`),
  CONSTRAINT `fk7` FOREIGN KEY (`writer`) REFERENCES `member` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk8` FOREIGN KEY (`placeId`) REFERENCES `place` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES (13,'여기 돈가스 진짜 가격도 저렴하고 맛있어요~','2024-08-24 23:07:38',5,'ehowl@gmail.com','487293560'),(14,'여기 라밥 가격 싸고 밑반찬도 맛있어요','2024-08-24 23:09:22',5,'vksek@gmail.com','487293560'),(15,'사장님도 친절하시고 음식의 양도 많아요','2024-08-24 23:09:23',4,'tndnjsthd@gmail.com','487293560'),(16,'인기 장소 핫플인 이유가 있네요 맛있습니다','2024-08-24 23:09:24',4,'zkwpsxn@gmail.com','487293560'),(17,'라밥 회현점 강추!! 추천합니다 가격 저렴하고 맛있습니다~','2024-08-24 23:09:24',5,'skskf@gmail.com','487293560'),(18,'여기 칼국수 진짜 맛있습니다. 가격도 착하고 양도 많고 맛있어서 놀랬습니다. 국물도 끝내줍니다.','2024-08-24 23:13:59',5,'ehowl@gmail.com','7818113'),(19,'아니 여기 칼국수 뭐에요? 국물 진짜 개존맛!!! 그리고 양도 진짜 많아요~ 9000원의 행복입니다~','2024-08-24 23:14:00',5,'zkwpsxn@gmail.com','7818113'),(20,'여기 칼국수도 진짜 맛있고 양도 많습니다. 그리고 칼국수 말고 보쌈,파전도 정말 맛있습니다! 강추합니다~','2024-08-24 23:14:01',5,'tndnjsthd@gmail.com','7818113'),(21,'제가 가봤던 콩나물국밥 중에서 TOP3 안에 듭니다. 정말 맛있구요! 남녀노소 누구나 좋아할 맛입니다!','2024-08-24 23:15:46',5,'vksek@gmail.com','859839051'),(22,'음식이 맛있고 사장님도 정말 친절하시고 분위기가 정말 좋았어요!','2024-08-24 23:18:34',5,'tndnjsthd@gmail.com','1863813515'),(23,'여기 자장면이 맛있고 런치코스 A,B 가 있는데 진짜 1인에서 먹기 정말 좋게 나오고 시설도 깨끗하고 좋았습니다!','2024-08-24 23:22:47',5,'zkwpsxn@gmail.com','8577709'),(24,'요즘 같은 물가에 자장면 가격이 7000원이에요~ 일단 가성비 자체가 말이 안되고 다양한 음식들이 있습니다!','2024-08-24 23:24:58',5,'zkwpsxn@gmail.com','7912905'),(25,'자장면+만두가 최고입니다~ 자장면 양도 많고 곱빼기가 500원 만 추가받는 옵션도 있어서 많이 드실거면 곱빼기 추천합니다!','2024-08-24 23:26:45',4,'zkwpsxn@gmail.com','8016538'),(27,'가볍게 커피나 라떼 한잔 하실거면 여기 강추합니다!! 위치가 명동쪽이여서 가격이 좀 나가긴 하지만 카페 분위기도 좋고 양도 많아여!','2024-08-24 23:31:45',4,'skskf@gmail.com','1062422741'),(28,'제가 가본 배라중에 시설도 넓고 괜찮았습니다! 쿠폰도 많이 줘서 좋은거같아여! 강추합니다!','2024-08-24 23:31:45',4,'skskf@gmail.com','1189986226'),(29,'내 인생 스끼야끼다..사랑해요','2024-08-24 23:45:06',5,'joha@gmail.com','23991500'),(30,'\'남친 최애 스끼야끼 맛집 한우 초밥도 진짜 맛있어요','2024-08-24 23:45:06',5,'eunsun@gmail.com','23991500'),(31,'여기 비싸긴한데 진짜 한달에 한번 꼭가요!!','2024-08-24 23:45:06',5,'hyunjin@gmail.com','23991500'),(32,'꼭 예약하고 가셔야돼요!! 한우 스끼야끼랑 한우불초밥 꼭 드세요!','2024-08-24 23:45:06',5,'hungry@gmail.com','23991500'),(33,'내 인생 소금빵 진짜 다른소금빵들이랑 차원이다르다','2024-08-24 23:46:58',5,'joha@gmail.com','1990677632'),(34,'집 근처에도 자연도 소금빵이 생기다니 ㅜㅜ 진짜 꼭드셔보세요','2024-08-24 23:46:58',5,'eunsun@gmail.com','1990677632'),(35,'냄새에 이끌려 갔던 곳인데 매주 사먹습니다 ㅎㅎ','2024-08-24 23:46:58',5,'hyunjin@gmail.com','1990677632'),(36,'어죽 처음 먹어봤는데 사계절 내내 생각나는 맛이에요','2024-08-24 23:47:58',5,'joha@gmail.com','787431047'),(37,'점심 특선 개혜자 혼자가도 반찬 엄청 많음 !!','2024-08-24 23:49:40',5,'jota@gmail.com','16036536'),(38,'양이 왜이렇게 많아요ㅜㅜ 반찬 다맛있고 제육 너무맛있어요!!','2024-08-24 23:49:40',5,'eunsun@gmail.com','16036536'),(39,'김치찌개 존맛탱구링','2024-08-24 23:49:40',5,'hyunjin@gmail.com','16036536'),(40,'고등학교때부터 온 원조할매곱창 미쳤다!!','2024-08-24 23:55:37',5,'joha@gmail.com','16527363'),(41,'등촌샤브칼국수집은 방이본점이 최고지!!!','2024-08-24 23:55:37',5,'joha@gmail.com','129475538'),(42,'담솥 여기 가지 매운솥밥 진짜 맛있어요 누룽지까지하면 미쳤어ㅠㅠ','2024-08-24 23:55:37',5,'joha@gmail.com','67327276'),(43,'작고 아기자기한 곳인데 혼밥하기 좋고 맛보는 퓨전음식들이 많아요!!\'','2024-08-24 23:55:37',5,'joha@gmail.com','1772290573'),(44,'존맛','2024-08-26 11:08:12',5,'vldkshcjswo@gmail.com','2143988257'),(45,'개맛잇음..','2024-08-26 11:11:01',5,'vldkshcjswo@gmail.com','1969790364'),(51,'경치가 맛있고 커피가 멋져요','2024-08-26 13:15:42',5,'unijk4187@gmail.com','861091174'),(52,'중국 안가도 됨','2024-08-26 13:16:03',4,'unijk4187@gmail.com','196328375'),(53,'분위기랑 맛 전부 끝내줘요','2024-08-26 13:16:26',5,'unijk4187@gmail.com','1623916036'),(54,'알바 시룸','2024-08-26 15:35:07',4,'jota@gmail.com','23991500'),(56,'알바생이 불친절했어요//','2024-08-26 17:07:27',4,'joha@gmail.com','1969790364');
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `review_view`
--

DROP TABLE IF EXISTS `review_view`;
/*!50001 DROP VIEW IF EXISTS `review_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `review_view` AS SELECT 
 1 AS `content`,
 1 AS `writer`,
 1 AS `writedate`,
 1 AS `nickname`,
 1 AS `rates`,
 1 AS `pname`,
 1 AS `categoryname`,
 1 AS `placeid`,
 1 AS `savefilename`,
 1 AS `reviewId`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `reviewimages`
--

DROP TABLE IF EXISTS `reviewimages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviewimages` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `savefilename` varchar(200) NOT NULL,
  `reviewId` int NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk9_idx` (`reviewId`),
  CONSTRAINT `fk9` FOREIGN KEY (`reviewId`) REFERENCES `review` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviewimages`
--

LOCK TABLES `reviewimages` WRITE;
/*!40000 ALTER TABLE `reviewimages` DISABLE KEYS */;
INSERT INTO `reviewimages` VALUES (10,'213131489997.jfif',13),(11,'21002021231.jfif',14),(12,'23423524.jpg',15),(13,'2054546541115.jfif',16),(14,'25857498744.jfif',17),(15,'26666644445.jfif',18),(16,'2444468787777789.jfif',19),(17,'254658789789777333.jfif',20),(18,'26666934777.jfif',21),(19,'2333456411135.jfif',22),(20,'2333456411135.jfif',23),(21,'23122314444445666.jfif',24),(22,'214444475114.jfif',25),(23,'2120411243.jpg',27),(24,'24654981897244.jfif',28),(25,'131027036.jpg',29),(26,'1203.jfif',30),(27,'12301.jfif',31),(28,'12303.jfif',32),(29,'13032101.jfif',33),(30,'13032102.jfif',34),(31,'13032103.jfif',35),(32,'14050401.jfif',37),(33,'14050402.jfif',38),(34,'14050403.jfif',39),(35,'131545838.jpg',36),(36,'131039223.jpg',40),(37,'131519668.jpg',41),(38,'190527853_02.jpg',42),(39,'190527853_01.jpg',43),(40,'제목 없음1724638091323.png',44),(41,'2024-05-051724638260597.jpg',45),(47,'판지21724645741219.jpg',51),(48,'마라탕1724645762690.jpg',52),(49,'초밥쓰1724645784964.jpg',53),(50,'2023-10-221724654106684.jpg',54),(52,'2023-10-221724659646482.jpg',56);
/*!40000 ALTER TABLE `reviewimages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `roleName` varchar(100) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'user'),(2,'admin'),(3,'deleted'),(4,'inactive');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userroles`
--

DROP TABLE IF EXISTS `userroles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userroles` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `roleId` int NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk10_idx` (`email`),
  KEY `fk11_idx` (`roleId`),
  CONSTRAINT `fk10` FOREIGN KEY (`email`) REFERENCES `member` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk11` FOREIGN KEY (`roleId`) REFERENCES `roles` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userroles`
--

LOCK TABLES `userroles` WRITE;
/*!40000 ALTER TABLE `userroles` DISABLE KEYS */;
/*!40000 ALTER TABLE `userroles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `matpli_view`
--

/*!50001 DROP VIEW IF EXISTS `matpli_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `matpli_view` AS select `m`.`email` AS `writer`,`m`.`nickname` AS `writernickname`,`p`.`ID` AS `id`,`p`.`listName` AS `listname`,`p`.`image` AS `image`,`p`.`favcount` AS `favcount` from (`member` `m` join `placelist` `p`) where (`m`.`email` = `p`.`writer`) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `review_view`
--

/*!50001 DROP VIEW IF EXISTS `review_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `review_view` AS select `a`.`content` AS `content`,`a`.`writer` AS `writer`,`a`.`writedate` AS `writedate`,`b`.`nickname` AS `nickname`,`a`.`rates` AS `rates`,`c`.`pname` AS `pname`,`c`.`categoryname` AS `categoryname`,`c`.`ID` AS `placeid`,`d`.`savefilename` AS `savefilename`,`d`.`reviewId` AS `reviewId` from (((`review` `a` join `member` `b`) join `place` `c`) join `reviewimages` `d`) where ((`a`.`writer` = `b`.`email`) and (`a`.`placeId` = `c`.`ID`) and (`a`.`ID` = `d`.`reviewId`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-29 14:44:27

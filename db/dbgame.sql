-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-09-2025 a las 07:45:58
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `dbgame`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `enemies`
--

CREATE TABLE `enemies` (
  `id` int(11) NOT NULL,
  `nombre` varchar(15) NOT NULL,
  `descripcion` varchar(50) DEFAULT NULL,
  `vida` int(11) NOT NULL,
  `damage` int(11) NOT NULL,
  `game_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `enemies`
--

INSERT INTO `enemies` (`id`, `nombre`, `descripcion`, `vida`, `damage`, `game_id`) VALUES
(1, 'estudiante', 'estudiante chico', 10, 5, 1),
(2, 'profesor', 'profesor_lentes', 10, 2, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `game`
--

CREATE TABLE `game` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `version` varchar(10) NOT NULL,
  `activo` tinyint(1) NOT NULL,
  `imagen_portada` varchar(50) DEFAULT NULL,
  `fecha_creacion` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `game`
--

INSERT INTO `game` (`id`, `nombre`, `descripcion`, `version`, `activo`, `imagen_portada`, `fecha_creacion`) VALUES
(1, 'ArrayRun', 'Juego de accion plataformero', '1.0', 1, 'ArrayRun.png', '2025-09-10 00:00:00'),
(4, 'Sonic', 'Sonic el erizo', '1.0', 1, 'sonic.jpg', '2020-01-01 00:00:00'),
(5, 'Mario bros', 'juego de family', '1.1', 1, 'mario_bros.png', '2020-01-01 00:00:00'),
(6, 'Contra', 'Contra juego de family', '1.0', 1, 'contra.jpg', '2020-01-01 00:00:00'),
(7, 'blasphemous', 'blasphemous 1', '1.0', 1, 'blasphemous.jpg', '2020-01-01 00:00:00'),
(8, 'Double Dragon', 'Double dragon 1', '1.0', 1, 'doubleDragon.jpg', '2020-01-01 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `item`
--

CREATE TABLE `item` (
  `id` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `tipo` varchar(15) NOT NULL,
  `damage` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `item`
--

INSERT INTO `item` (`id`, `nombre`, `tipo`, `damage`) VALUES
(1, 'espada', 'acero', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `level`
--

CREATE TABLE `level` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(50) DEFAULT NULL,
  `dificultad` double NOT NULL,
  `game_id` int(11) DEFAULT NULL,
  `lvl_number` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `level`
--

INSERT INTO `level` (`id`, `nombre`, `descripcion`, `dificultad`, `game_id`, `lvl_number`) VALUES
(1, 'Pasillo del aula', 'aula 5', 4, 1, 1),
(2, 'clases matematicas', 'Curso matematicas 1, piso 2', 5, 1, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `level_enemies`
--

CREATE TABLE `level_enemies` (
  `id` int(11) NOT NULL,
  `level_id` int(11) DEFAULT NULL,
  `enemies_id` int(11) DEFAULT NULL,
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `level_enemies`
--

INSERT INTO `level_enemies` (`id`, `level_id`, `enemies_id`, `cantidad`) VALUES
(1, 2, 1, 5),
(2, 2, 2, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `messenger_messages`
--

CREATE TABLE `messenger_messages` (
  `id` bigint(20) NOT NULL,
  `body` longtext NOT NULL,
  `headers` longtext NOT NULL,
  `queue_name` varchar(190) NOT NULL,
  `created_at` datetime NOT NULL,
  `available_at` datetime NOT NULL,
  `delivered_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `player`
--

CREATE TABLE `player` (
  `id` int(11) NOT NULL,
  `games_id` int(11) DEFAULT NULL,
  `nombre` varchar(50) NOT NULL,
  `nivel` int(11) NOT NULL,
  `experiencia` double NOT NULL,
  `vida_actual` int(11) NOT NULL,
  `vida_maxima` int(11) NOT NULL,
  `fecha_creacion` datetime NOT NULL,
  `ultima_conexion` datetime NOT NULL,
  `speed` double DEFAULT NULL,
  `jump_speed` double DEFAULT NULL,
  `name_sprite` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `player`
--

INSERT INTO `player` (`id`, `games_id`, `nombre`, `nivel`, `experiencia`, `vida_actual`, `vida_maxima`, `fecha_creacion`, `ultima_conexion`, `speed`, `jump_speed`, `name_sprite`) VALUES
(3, 1, 'El Chico', 1, 1, 8, 8, '2025-09-20 00:00:00', '2025-09-20 00:00:00', 200, 1300, 'player_chico'),
(4, 1, 'La Chica', 1, 1, 3, 3, '2025-09-21 00:00:00', '2025-09-21 00:00:00', 700, 1000, 'player_chica');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `saves`
--

CREATE TABLE `saves` (
  `id` int(11) NOT NULL,
  `pos_x` double NOT NULL,
  `pos_y` double NOT NULL,
  `vidas_restantes` int(11) NOT NULL,
  `fecha_guardado` datetime NOT NULL,
  `game_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `saves`
--

INSERT INTO `saves` (`id`, `pos_x`, `pos_y`, `vidas_restantes`, `fecha_guardado`, `game_id`) VALUES
(2, 5, 1, 3, '2020-01-01 00:00:00', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `score`
--

CREATE TABLE `score` (
  `id` int(11) NOT NULL,
  `player_id` int(11) DEFAULT NULL,
  `saves_id` int(11) DEFAULT NULL,
  `puntos` int(11) NOT NULL,
  `fecha_guardado` datetime NOT NULL,
  `game_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sprite`
--

CREATE TABLE `sprite` (
  `id` int(11) NOT NULL,
  `imagen_path` varchar(255) DEFAULT NULL,
  `action` varchar(20) NOT NULL,
  `player_id` int(11) DEFAULT NULL,
  `enemies_id` int(11) DEFAULT NULL,
  `game_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(180) NOT NULL,
  `roles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`roles`)),
  `password` varchar(255) NOT NULL,
  `email` varchar(180) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id`, `username`, `roles`, `password`, `email`) VALUES
(8, 'gordo', '[]', '$2y$13$T3.YvA2u9aRAVm.bT0Nb1OkDOLGqVgO2oDoCNYR44wAfBbSHzfLRG', 'garca@gmail.com'),
(10, 'Facundo', '[]', '$2y$13$gbCj8Zp9e0ru4eqMfJWNHu1fG9Kvid2b8U5svl9KClrxxrcSMolii', 'facundosnake@gmail.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_item`
--

CREATE TABLE `user_item` (
  `id` int(11) NOT NULL,
  `player_id` int(11) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL,
  `cantidad` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_level`
--

CREATE TABLE `user_level` (
  `id` int(11) NOT NULL,
  `player_id` int(11) DEFAULT NULL,
  `level_id` int(11) DEFAULT NULL,
  `completado` tinyint(1) NOT NULL,
  `tiempo_usado` int(11) NOT NULL,
  `puntos_obtenidos` int(11) NOT NULL,
  `game_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user_level`
--

INSERT INTO `user_level` (`id`, `player_id`, `level_id`, `completado`, `tiempo_usado`, `puntos_obtenidos`, `game_id`) VALUES
(4, 3, 1, 1, 45, 65, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_player`
--

CREATE TABLE `user_player` (
  `user_id` int(11) DEFAULT NULL,
  `player_id` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user_player`
--

INSERT INTO `user_player` (`user_id`, `player_id`, `id`) VALUES
(10, 3, 1),
(10, 4, 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `enemies`
--
ALTER TABLE `enemies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_78024A3EE48FD905` (`game_id`);

--
-- Indices de la tabla `game`
--
ALTER TABLE `game`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `level`
--
ALTER TABLE `level`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_9AEACC13E48FD905` (`game_id`);

--
-- Indices de la tabla `level_enemies`
--
ALTER TABLE `level_enemies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_D9AA6F215FB14BA7` (`level_id`),
  ADD KEY `IDX_D9AA6F21AC2CCB71` (`enemies_id`);

--
-- Indices de la tabla `messenger_messages`
--
ALTER TABLE `messenger_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_75EA56E0FB7336F0` (`queue_name`),
  ADD KEY `IDX_75EA56E0E3BD61CE` (`available_at`),
  ADD KEY `IDX_75EA56E016BA31DB` (`delivered_at`);

--
-- Indices de la tabla `player`
--
ALTER TABLE `player`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_98197A6597FFC673` (`games_id`);

--
-- Indices de la tabla `saves`
--
ALTER TABLE `saves`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_7A3056E2E48FD905` (`game_id`);

--
-- Indices de la tabla `score`
--
ALTER TABLE `score`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_3299375161F0BFA` (`saves_id`),
  ADD KEY `IDX_32993751E48FD905` (`game_id`),
  ADD KEY `IDX_3299375199E6F5DF` (`player_id`);

--
-- Indices de la tabla `sprite`
--
ALTER TABLE `sprite`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_351D8F9EAC2CCB71` (`enemies_id`),
  ADD KEY `IDX_351D8F9EE48FD905` (`game_id`),
  ADD KEY `IDX_351D8F9E99E6F5DF` (`player_id`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_8D93D649F85E0677` (`username`),
  ADD UNIQUE KEY `UNIQ_8D93D649E7927C74` (`email`);

--
-- Indices de la tabla `user_item`
--
ALTER TABLE `user_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_659A69D7126F525E` (`item_id`),
  ADD KEY `IDX_659A69D799E6F5DF` (`player_id`);

--
-- Indices de la tabla `user_level`
--
ALTER TABLE `user_level`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_7828374B5FB14BA7` (`level_id`),
  ADD KEY `IDX_7828374BE48FD905` (`game_id`),
  ADD KEY `IDX_7828374B99E6F5DF` (`player_id`);

--
-- Indices de la tabla `user_player`
--
ALTER TABLE `user_player`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_FD4B6158A76ED395` (`user_id`),
  ADD KEY `IDX_FD4B615899E6F5DF` (`player_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `enemies`
--
ALTER TABLE `enemies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `game`
--
ALTER TABLE `game`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `item`
--
ALTER TABLE `item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `level`
--
ALTER TABLE `level`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `level_enemies`
--
ALTER TABLE `level_enemies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `messenger_messages`
--
ALTER TABLE `messenger_messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `player`
--
ALTER TABLE `player`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `saves`
--
ALTER TABLE `saves`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `score`
--
ALTER TABLE `score`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `sprite`
--
ALTER TABLE `sprite`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `user_item`
--
ALTER TABLE `user_item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `user_level`
--
ALTER TABLE `user_level`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `user_player`
--
ALTER TABLE `user_player`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `enemies`
--
ALTER TABLE `enemies`
  ADD CONSTRAINT `FK_78024A3EE48FD905` FOREIGN KEY (`game_id`) REFERENCES `game` (`id`);

--
-- Filtros para la tabla `level`
--
ALTER TABLE `level`
  ADD CONSTRAINT `FK_9AEACC13E48FD905` FOREIGN KEY (`game_id`) REFERENCES `game` (`id`);

--
-- Filtros para la tabla `level_enemies`
--
ALTER TABLE `level_enemies`
  ADD CONSTRAINT `FK_D9AA6F215FB14BA7` FOREIGN KEY (`level_id`) REFERENCES `level` (`id`),
  ADD CONSTRAINT `FK_D9AA6F21AC2CCB71` FOREIGN KEY (`enemies_id`) REFERENCES `enemies` (`id`);

--
-- Filtros para la tabla `player`
--
ALTER TABLE `player`
  ADD CONSTRAINT `FK_98197A6597FFC673` FOREIGN KEY (`games_id`) REFERENCES `game` (`id`);

--
-- Filtros para la tabla `saves`
--
ALTER TABLE `saves`
  ADD CONSTRAINT `FK_7A3056E2E48FD905` FOREIGN KEY (`game_id`) REFERENCES `game` (`id`);

--
-- Filtros para la tabla `score`
--
ALTER TABLE `score`
  ADD CONSTRAINT `FK_3299375161F0BFA` FOREIGN KEY (`saves_id`) REFERENCES `saves` (`id`),
  ADD CONSTRAINT `FK_3299375199E6F5DF` FOREIGN KEY (`player_id`) REFERENCES `player` (`id`),
  ADD CONSTRAINT `FK_32993751E48FD905` FOREIGN KEY (`game_id`) REFERENCES `game` (`id`);

--
-- Filtros para la tabla `sprite`
--
ALTER TABLE `sprite`
  ADD CONSTRAINT `FK_351D8F9E99E6F5DF` FOREIGN KEY (`player_id`) REFERENCES `player` (`id`),
  ADD CONSTRAINT `FK_351D8F9EAC2CCB71` FOREIGN KEY (`enemies_id`) REFERENCES `enemies` (`id`),
  ADD CONSTRAINT `FK_351D8F9EE48FD905` FOREIGN KEY (`game_id`) REFERENCES `game` (`id`);

--
-- Filtros para la tabla `user_item`
--
ALTER TABLE `user_item`
  ADD CONSTRAINT `FK_659A69D7126F525E` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`),
  ADD CONSTRAINT `FK_659A69D799E6F5DF` FOREIGN KEY (`player_id`) REFERENCES `player` (`id`);

--
-- Filtros para la tabla `user_level`
--
ALTER TABLE `user_level`
  ADD CONSTRAINT `FK_7828374B5FB14BA7` FOREIGN KEY (`level_id`) REFERENCES `level` (`id`),
  ADD CONSTRAINT `FK_7828374B99E6F5DF` FOREIGN KEY (`player_id`) REFERENCES `player` (`id`),
  ADD CONSTRAINT `FK_7828374BE48FD905` FOREIGN KEY (`game_id`) REFERENCES `game` (`id`);

--
-- Filtros para la tabla `user_player`
--
ALTER TABLE `user_player`
  ADD CONSTRAINT `FK_FD4B615899E6F5DF` FOREIGN KEY (`player_id`) REFERENCES `player` (`id`),
  ADD CONSTRAINT `FK_FD4B6158A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

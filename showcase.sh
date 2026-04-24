#!/bin/bash

DB="appointments_db"
USER="appointments"
PASS="appointments123"
CMD="mariadb -u $USER -p$PASS $DB"

divider() { echo "────────────────────────────────────────────────────────"; }

echo ""
echo "  APPOINTMENTS APP — DATABASE SHOWCASE"
divider

echo ""
echo "  TABLES"
divider
$CMD -e "SHOW TABLES;"

echo ""
echo "  TOPICS"
divider
$CMD -e "SELECT * FROM topics ORDER BY name;"

echo ""
echo "  BRANCHES"
divider
$CMD -e "SELECT * FROM branches ORDER BY name;"

echo ""
echo "  BRANCH → TOPIC RELATIONSHIPS"
divider
$CMD -e "
SELECT b.name AS branch, t.name AS topic
FROM branch_topics bt
JOIN branches b ON bt.branch_id = b.id
JOIN topics t ON bt.topic_id = t.id
ORDER BY b.name, t.name;
"

echo ""
echo "  APPOINTMENTS"
divider
$CMD -e "
SELECT
  a.id,
  CONCAT(a.first_name, ' ', a.last_name) AS customer,
  a.email,
  a.phone,
  t.name AS topic,
  b.name AS branch,
  a.date,
  a.time,
  a.status
FROM appointments a
JOIN topics t ON a.topic_id = t.id
JOIN branches b ON a.branch_id = b.id
ORDER BY a.date, a.time;
"

echo ""
echo "  ROW COUNTS"
divider
$CMD -e "
SELECT 'topics'       AS table_name, COUNT(*) AS total FROM topics
UNION ALL
SELECT 'branches',                   COUNT(*)         FROM branches
UNION ALL
SELECT 'branch_topics',              COUNT(*)         FROM branch_topics
UNION ALL
SELECT 'appointments',               COUNT(*)         FROM appointments;
"
echo ""

-- Digital Gap (DGAP) — database schema
-- Import via Hostinger hPanel > Databases > phpMyAdmin > (your database) > Import.
-- The server also applies these statements on boot (CREATE ... IF NOT EXISTS), so a fresh database self-initialises.

CREATE TABLE IF NOT EXISTS leads (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  company VARCHAR(160) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(40) NULL,
  stage VARCHAR(60) NULL,
  message TEXT NULL,
  locale VARCHAR(8) NOT NULL DEFAULT 'en',
  source_path VARCHAR(255) NULL,
  ip_hash CHAR(64) NULL,
  user_agent VARCHAR(255) NULL,
  status ENUM('new', 'contacted', 'qualified', 'proposal', 'won', 'lost', 'spam') NOT NULL DEFAULT 'new',
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_leads_created (created_at),
  KEY idx_leads_status (status),
  KEY idx_leads_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin login sessions (used by express-mysql-session)
CREATE TABLE IF NOT EXISTS sessions (
  session_id VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  expires INT UNSIGNED NOT NULL,
  data MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Admin activity log (logins, status changes, deletions)
CREATE TABLE IF NOT EXISTS admin_audit (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  actor VARCHAR(190) NOT NULL,
  action VARCHAR(40) NOT NULL,
  lead_id INT UNSIGNED NULL,
  detail VARCHAR(255) NULL,
  ip_hash CHAR(64) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_audit_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

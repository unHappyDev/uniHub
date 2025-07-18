-- Firewall Create User
CREATE OR REPLACE FUNCTION firewall_create_user(clientIp inet) RETURNS boolean AS $$
DECLARE
  users_count integer;
BEGIN
  users_count := (
    SELECT
      COUNT(*)
    FROM
      "Event"
    WHERE
      originator_ip = clientIp
      AND type = 'create:user'
      AND created_at > NOW() - INTERVAL '5 seconds'
  );

  IF users_count >= 2 THEN
    RETURN false;
  ELSE
    RETURN true;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Firewall Create User Side Effect
DROP FUNCTION IF EXISTS firewall_create_user_side_effect(IN client_ip_input inet);

CREATE OR REPLACE FUNCTION firewall_create_user_side_effect(IN client_ip_input inet)
RETURNS TABLE (id uuid, username varchar, email varchar)
LANGUAGE plpgsql AS $$
DECLARE
  users_to_block record;
BEGIN
  FOR users_to_block IN (
    SELECT metadata->>'id' as id
    FROM "Event"
    WHERE type = 'create:user'
      AND originator_ip = client_ip_input
      AND created_at > NOW() - INTERVAL '30 minutes'
  )
  LOOP
    UPDATE "User"
    SET role = 'BLOCKED'
    WHERE "User"."id" = users_to_block.id::uuid
    RETURNING "User"."id", "User"."username", "User"."email"
    INTO id, username, email;

    RETURN NEXT;
  END LOOP;
END;
$$;




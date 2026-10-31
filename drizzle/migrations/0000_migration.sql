CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id text NOT NULL,
  service_name text NOT NULL,
  stylist_id text NOT NULL,
  booking_date date NOT NULL,
  time_slot text NOT NULL,
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (stylist_id, booking_date, time_slot)
);
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.get_booked_slots(_date date)
RETURNS TABLE(stylist_id text, time_slot text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT b.stylist_id, b.time_slot FROM public.bookings b WHERE b.booking_date = _date;
$$;

CREATE OR REPLACE FUNCTION public.create_booking(
  _service_id text, _service_name text, _stylist_id text, _date date, _slot text,
  _name text, _phone text, _email text, _stylists text[]
) RETURNS TABLE(id uuid, stylist_id text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE chosen text; new_id uuid;
BEGIN
  IF length(trim(_name)) < 2 OR length(_name) > 100 THEN RAISE EXCEPTION 'Invalid name'; END IF;
  IF _phone !~ '^[0-9+ ()-]{7,20}$' THEN RAISE EXCEPTION 'Invalid phone'; END IF;
  IF _email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' OR length(_email) > 255 THEN RAISE EXCEPTION 'Invalid email'; END IF;
  IF _date < current_date OR _date > current_date + 60 THEN RAISE EXCEPTION 'Invalid date'; END IF;
  IF _slot !~ '^[0-2][0-9]:[0-5][0-9]$' THEN RAISE EXCEPTION 'Invalid slot'; END IF;
  IF _stylist_id = 'any' THEN
    SELECT s INTO chosen FROM unnest(_stylists) s
      WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.stylist_id = s AND b.booking_date = _date AND b.time_slot = _slot)
      LIMIT 1;
    IF chosen IS NULL THEN RAISE EXCEPTION 'Slot no longer available'; END IF;
  ELSE chosen := _stylist_id; END IF;
  BEGIN
    INSERT INTO bookings(service_id, service_name, stylist_id, booking_date, time_slot, customer_name, phone, email)
    VALUES (left(_service_id,60), left(_service_name,120), left(chosen,60), _date, _slot, trim(_name), trim(_phone), lower(trim(_email)))
    RETURNING bookings.id INTO new_id;
  EXCEPTION WHEN unique_violation THEN RAISE EXCEPTION 'Slot no longer available'; END;
  RETURN QUERY SELECT new_id, chosen;
END; $$;

GRANT EXECUTE ON FUNCTION public.get_booked_slots(date) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_booking(text,text,text,date,text,text,text,text,text[]) TO anon, authenticated;
PGDMP                       }            TestDB    16.3    16.3 *               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16397    TestDB    DATABASE     �   CREATE DATABASE "TestDB" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Philippines.1252';
    DROP DATABASE "TestDB";
                postgres    false            �            1259    16783    attendance_records    TABLE       CREATE TABLE public.attendance_records (
    id integer NOT NULL,
    user_id integer NOT NULL,
    class character varying(255) NOT NULL,
    student_number character varying(20) NOT NULL,
    full_name character varying(255) NOT NULL,
    attendance_date date NOT NULL,
    status character(1) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    section character varying(50),
    CONSTRAINT attendance_records_status_check CHECK ((status = ANY (ARRAY['P'::bpchar, 'A'::bpchar])))
);
 &   DROP TABLE public.attendance_records;
       public         heap    postgres    false            �            1259    16782    attendance_records_id_seq    SEQUENCE     �   CREATE SEQUENCE public.attendance_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.attendance_records_id_seq;
       public          postgres    false    223                       0    0    attendance_records_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.attendance_records_id_seq OWNED BY public.attendance_records.id;
          public          postgres    false    222            �            1259    16671    subjects    TABLE     �   CREATE TABLE public.subjects (
    subject_code character varying(10) NOT NULL,
    subject_name character varying(255) NOT NULL
);
    DROP TABLE public.subjects;
       public         heap    postgres    false            �            1259    16729    user_students    TABLE     k  CREATE TABLE public.user_students (
    id integer NOT NULL,
    user_id integer NOT NULL,
    student_number character varying(255) NOT NULL,
    full_name character varying(255) NOT NULL,
    class integer NOT NULL,
    first_name character varying(50) NOT NULL,
    middle_initial character varying(5) NOT NULL,
    last_name character varying(50) NOT NULL
);
 !   DROP TABLE public.user_students;
       public         heap    postgres    false            �            1259    16728    user_students_id_seq    SEQUENCE     �   CREATE SEQUENCE public.user_students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.user_students_id_seq;
       public          postgres    false    221                       0    0    user_students_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.user_students_id_seq OWNED BY public.user_students.id;
          public          postgres    false    220            �            1259    16677    user_subjects    TABLE     �   CREATE TABLE public.user_subjects (
    id integer NOT NULL,
    user_id integer NOT NULL,
    subject_code character varying(10),
    subject_name character varying(255),
    section character varying(50)
);
 !   DROP TABLE public.user_subjects;
       public         heap    postgres    false            �            1259    16676    user_subjects_id_seq    SEQUENCE     �   CREATE SEQUENCE public.user_subjects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.user_subjects_id_seq;
       public          postgres    false    219                       0    0    user_subjects_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.user_subjects_id_seq OWNED BY public.user_subjects.id;
          public          postgres    false    218            �            1259    16651    users    TABLE     �   CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    password character varying(100) NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    16650    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    216                       0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    215            f           2604    16786    attendance_records id    DEFAULT     ~   ALTER TABLE ONLY public.attendance_records ALTER COLUMN id SET DEFAULT nextval('public.attendance_records_id_seq'::regclass);
 D   ALTER TABLE public.attendance_records ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    222    223    223            e           2604    16732    user_students id    DEFAULT     t   ALTER TABLE ONLY public.user_students ALTER COLUMN id SET DEFAULT nextval('public.user_students_id_seq'::regclass);
 ?   ALTER TABLE public.user_students ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    221    221            d           2604    16680    user_subjects id    DEFAULT     t   ALTER TABLE ONLY public.user_subjects ALTER COLUMN id SET DEFAULT nextval('public.user_subjects_id_seq'::regclass);
 ?   ALTER TABLE public.user_subjects ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    218    219            c           2604    16654    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    215    216                      0    16783    attendance_records 
   TABLE DATA           �   COPY public.attendance_records (id, user_id, class, student_number, full_name, attendance_date, status, created_at, section) FROM stdin;
    public          postgres    false    223   �3                 0    16671    subjects 
   TABLE DATA           >   COPY public.subjects (subject_code, subject_name) FROM stdin;
    public          postgres    false    217   7                 0    16729    user_students 
   TABLE DATA           }   COPY public.user_students (id, user_id, student_number, full_name, class, first_name, middle_initial, last_name) FROM stdin;
    public          postgres    false    221   �7                 0    16677    user_subjects 
   TABLE DATA           Y   COPY public.user_subjects (id, user_id, subject_code, subject_name, section) FROM stdin;
    public          postgres    false    219   9                 0    16651    users 
   TABLE DATA           7   COPY public.users (id, username, password) FROM stdin;
    public          postgres    false    216   �9                  0    0    attendance_records_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.attendance_records_id_seq', 59, true);
          public          postgres    false    222                       0    0    user_students_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.user_students_id_seq', 40, true);
          public          postgres    false    220                        0    0    user_subjects_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.user_subjects_id_seq', 16, true);
          public          postgres    false    218            !           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 4, true);
          public          postgres    false    215            v           2606    16792 *   attendance_records attendance_records_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.attendance_records DROP CONSTRAINT attendance_records_pkey;
       public            postgres    false    223            n           2606    16675    subjects subjects_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (subject_code);
 @   ALTER TABLE ONLY public.subjects DROP CONSTRAINT subjects_pkey;
       public            postgres    false    217            r           2606    16736     user_students user_students_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.user_students
    ADD CONSTRAINT user_students_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.user_students DROP CONSTRAINT user_students_pkey;
       public            postgres    false    221            t           2606    16738 <   user_students user_students_user_id_student_number_class_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.user_students
    ADD CONSTRAINT user_students_user_id_student_number_class_key UNIQUE (user_id, student_number, class);
 f   ALTER TABLE ONLY public.user_students DROP CONSTRAINT user_students_user_id_student_number_class_key;
       public            postgres    false    221    221    221            p           2606    16682     user_subjects user_subjects_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.user_subjects
    ADD CONSTRAINT user_subjects_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.user_subjects DROP CONSTRAINT user_subjects_pkey;
       public            postgres    false    219            j           2606    16656    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    216            l           2606    16658    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public            postgres    false    216            z           2606    16793 2   attendance_records attendance_records_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 \   ALTER TABLE ONLY public.attendance_records DROP CONSTRAINT attendance_records_user_id_fkey;
       public          postgres    false    216    223    4714            {           2606    16798    attendance_records fk_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 D   ALTER TABLE ONLY public.attendance_records DROP CONSTRAINT fk_user;
       public          postgres    false    223    216    4714            x           2606    16744 &   user_students user_students_class_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_students
    ADD CONSTRAINT user_students_class_fkey FOREIGN KEY (class) REFERENCES public.user_subjects(id) ON DELETE CASCADE;
 P   ALTER TABLE ONLY public.user_students DROP CONSTRAINT user_students_class_fkey;
       public          postgres    false    221    4720    219            y           2606    16739 (   user_students user_students_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_students
    ADD CONSTRAINT user_students_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 R   ALTER TABLE ONLY public.user_students DROP CONSTRAINT user_students_user_id_fkey;
       public          postgres    false    216    221    4714            w           2606    16683 (   user_subjects user_subjects_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_subjects
    ADD CONSTRAINT user_subjects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 R   ALTER TABLE ONLY public.user_subjects DROP CONSTRAINT user_subjects_user_id_fkey;
       public          postgres    false    4714    219    216               h  x����n�HE��W����/�gf�a6f1Ȧcub$2 �`�������C�2(�t=nU�e2{Wm�gvS����mX,��mj�M�)u%��.����Tebל��2fJ(��
?����	�k����{p:�^�i�!�)�Dx��i��h� )f�|v[M���T�"xe-�4A*����?ƞ8�7mc3�$�Z\ȮL�1�s#��?W��,M0�bH�`=UZ$��/�q��6nV}dw��i�A?�1�MU7=1��QM!m�{@w��SAa] �$���;(������\ �_6k?	C���W�����"�������얳�:���B�@�W��8�
 s��s �r�f����/�s���(�Ci�1��F:��w�Ѿ+�Ž :��	�*�W� ot����X�\#|gxi��z�S9:�+�(t�\s���[�X_|Q�B����92�B��sm�B@vӓ�z*Gc� �ԴL��6�ȑ��W�q�4���6��M����T�ݾ,�c[T=�zb��"q��\n� �j���LJ����\��~������\�U@S���8#XI� 8�����{LY�n��Ш\�Ft�A��=g	��.��f;�և���ZI��2�,����o��IX<�O0�1��M�h�n�s[|I��}�$&��Ak}��P �J�+���Bh�>����o)*���s����=~mڴ��*��c��?~Ⱥ��cxp�ri�3�ݠ�W���w��Mb/���~)lqeS�8!첻bӐ���:����kG[�fT�8�}�O�����2x~��KU��O���ƽ.��V+I�TU�ƅ�����*;�j���V�ou��]         �   x�e��N�0���S�	@e���]���^��I��E����t�'n����ؽ��θ������7�K5�κ��]��T�2Y�2K�>�Qۀ���Q6Ã�Q�sd�i���*�Q9]�G�'
��V�%ќ&��\6����I���/�C��\�s$))_;�܂B��h�����:sH�=8ξ����o��2������+k��b�            x�E�An�0E�N��l]�D*"��S,j��i��kH������C�(�����2�:�go��\�"Q��»�YÙ�z��3����ݬx�ә��5z��D9"��	y�K�֌�~~�&��?#/w�DB�\�"����8�z+7.>�9վ]�%�e��ʺ�G;}�����H��x2��;q�֥wW��Pc�!k�y2.�?�ko���
c`c$������Y��Q�ڹ�H-VB���IqN         }   x�=��
�0Dϛ��/������R!WA����&�{�K�3����n��`�0}x�"��r�gc�[��
!��^�zc�b\T�UJ
cۍnẨ��Z��酣|٣��k��8֜�\o�;c�?�)�         �   x�5���   �<�g��c�j���M�������}����'�zz~����Sk�i8&��ү���9@ƹ��Z��(��viS���X3�% �v���,�3�w祏�+����a�x�	v�'9vVk�[-?�!�X� �J*�     
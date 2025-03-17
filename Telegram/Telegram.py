import os
import sys
import django
import datetime
import logging
from pyrogram import Client, filters
from pyrogram.types import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from pyrogram.enums import ChatMemberStatus
from asgiref.sync import sync_to_async
import jwt
import confing
from django.db.models import F

from pyrogram.errors import PeerIdInvalid






# Configure logging
log_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'telegram_bot_errors.log')
logging.basicConfig(
    level=logging.ERROR,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file_path),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)




# Django setup
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'webapp.settings')
django.setup()

from Home_Module.models import TelegramUser, TelegramMessage, UserData
from django.conf import settings
from django.db import transaction


# Constants
API_ID = confing.API_ID
API_HASH = confing.API_HASH
BOT_TOKEN = confing.BOT_TOKEN
CHANNEL_USERNAME = confing.CHANNEL_USERNAME


FISRAT_MESSAGE='''
Welcome to the MORI Airdrop.  
Here, we will help you build your personal economy.  
Please Subscribe our Telegram channel first, and then press the "Check" button again.
'''


MAIN_ADMINS = confing.MAIN_ADMINS

# Initialize Pyrogram Client
session_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "web_app_mori_ai_telegram.session")
if os.path.exists(session_file):
    os.remove(session_file)

app = Client(
    "web_app_mori_ai_telegram",
    api_id=API_ID,
    api_hash=API_HASH,
    bot_token=BOT_TOKEN,
)

# Globals
join_messages = {}  # Dictionary to store join prompt message IDs
user_invite_codes = {}  # To store invite codes for users



# Helper functions
async def create_jwt_token(user_id):
    try:
        if not confing.SETTINGS.SECRET_KEY:
            raise ValueError("SECRET_KEY is not set in settings.")

        payload = {
            'user_id': user_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)  # Token expiration time
        }

        token = jwt.encode(payload, confing.SETTINGS.SECRET_KEY, algorithm='HS256')
        if isinstance(token, bytes):  # PyJWT 2.x returns str by default
            token = token.decode('utf-8')

        # Update or create the user token asynchronously
        user, created = await sync_to_async(TelegramUser.objects.update_or_create)(
            telegram_user_id=user_id,
            defaults={'token': token}
        )

        return token
    except Exception as e:
        logger.error(f"Error in create_jwt_token: {e}")
        return None




@sync_to_async
def fetch_inviter_user(referral_code):
    try:
        return TelegramUser.objects.get(referral_code=referral_code)
    except TelegramUser.DoesNotExist:

        return None


@sync_to_async
def add_invite_to_inviter(inviter, new_user, is_premium):
    try:
        # Fetch or create the inviter and new_user UserData
        inviter_data, created_inviter = UserData.objects.get_or_create(user=inviter)
        new_user_data, created_new_user = UserData.objects.get_or_create(user=new_user)

        # Check if the inviter has already invited this new_user
        already_invited = inviter_data.invite.filter(id=new_user.id).exists()
        if already_invited:
            return True, 0, 0  # If already invited, return early with no change

        # Set count values based on whether the user is premium or not
        if is_premium:
            inviter_count = 25000
            new_user_count = 20000
        else:
            inviter_count = 10000
            new_user_count = 10000

        # Increment the inviter's and new user's count
        inviter_data.count += inviter_count
        new_user_data.count += new_user_count

        # Save the inviter's invite relationship
        inviter_data.invite.add(new_user)

        # Save both inviter_data and new_user_data
        inviter_data.save()
        new_user_data.save()

        return False, inviter_count, new_user_count

    except Exception as e:
        # Log the error for further debugging
        logger.error(f"Error in add_invite_to_inviter: {e}")
        return False, 0, 0


@sync_to_async
def create_user_and_userdata(telegram_user_id, username, first_name, last_name):
    try:
        with transaction.atomic():
            user, created = TelegramUser.objects.get_or_create(
                telegram_user_id=telegram_user_id,
                defaults={
                    'username': username,
                    'first_name': first_name,
                    'last_name': last_name,

                }
            )
            if created:
                UserData.objects.create(user=user)
            return user, created
    except Exception as e:
        logger.error(f"Error in create_user_and_userdata: {e}")
        return None, False



@sync_to_async
def get_or_create_user(telegram_user_id, username, first_name, last_name):
    try:
        # Ensure defaults are not None and have valid values
        user, created = TelegramUser.objects.get_or_create(
            telegram_user_id=telegram_user_id,
            defaults={
                'username': username if username else 'UnknownUsername',
                'first_name': first_name if first_name else 'UnknownFirstName',
                'last_name': last_name if last_name else 'UnknownLastName',
            }
        )
        if created:
            UserData.objects.create(user=user)
        return user, created
    except Exception as e:
        logger.error(f"Error in get_or_create_user: {e}")
        return None, False  # Ensure None is returned if user creation fails


@sync_to_async
def check_existing_invite(user_data, inviter_user):

    if user_data.invited_by is not None:
        if user_data.invited_by != inviter_user:
            return "already_invited_by_another"
        else:
            return "already_invited_by_same"
    return None

@sync_to_async
def update_invited_by(user_data, inviter_user):
    user_data.invited_by = inviter_user
    user_data.save()



async def process_invite(client, user, user_data, inviter_user, is_premium, chat_id, message, created):


    if user_data.invited_by and user_data.invited_by != inviter_user:

        return await start(client, message)

    already_invited, inviter_count, new_user_count  = await add_invite_to_inviter(inviter_user, user, is_premium)




    #Update invitee information and give reward if they weren't already invited
    if not already_invited:
        await update_invited_by(user_data, inviter_user)
        user_data.reward_given = True
        await sync_to_async(user_data.save)()


        if created:
            # await client.send_message(
            #     chat_id=user.telegram_user_id,
            #     text=f"Congratulations! You have received {new_user_count} points for joining with an invite link."
            # )

            await client.send_message(
                chat_id=inviter_user.telegram_user_id,
                text=f"Your invitee has joined. You have received {inviter_count} points as a reward."
            )


    try:
        member = await client.get_chat_member(CHANNEL_USERNAME, chat_id)
    except Exception as e:
        join_message = await client.send_message(
            chat_id=chat_id,
            text=FISRAT_MESSAGE,
            reply_markup=InlineKeyboardMarkup(
                [
                    [InlineKeyboardButton("Subscribe to the channel", url=f"https://t.me/{CHANNEL_USERNAME}")],
                    [InlineKeyboardButton("Check", callback_data=f'checkuserjoin_{chat_id}')],
                ]
            )
        )
        join_messages[chat_id] = join_message.id
        return

    return await start(client, message)



@app.on_message(filters.private & filters.regex(r'^/start invite_(\w+)$'))
async def invite_user(client, message):
    chat_id = message.chat.id
    invite_code = message.matches[0].group(1)
    telegram_user_id = message.from_user.id
    username = message.from_user.username
    first_name = message.from_user.first_name
    last_name = message.from_user.last_name
    is_premium = getattr(message.from_user, 'is_premium', False)

    inviter_user = await fetch_inviter_user(invite_code)
    if not inviter_user:
        await message.reply("Invalid invite code.")
        return

    if inviter_user.telegram_user_id == telegram_user_id:
        await message.reply("You cannot use your own referral code.")
        return await start(client, message)

    # Check if the user already exists
    user, created = await get_or_create_user(telegram_user_id, username, first_name, last_name)

    # If user already exists, return to the start function
    if not created:
        return await start(client, message)

    if not user:
        return

    try:
        user_data = await sync_to_async(UserData.objects.get)(user=user)
    except UserData.DoesNotExist:
        user_data = await sync_to_async(UserData.objects.create)(user=user)

    invite_status = await check_existing_invite(user_data, inviter_user)

    if invite_status == "already_invited_by_another":
        return await start(client, message)
    elif invite_status == "already_invited_by_same":
        return await start(client, message)
    else:
        await process_invite(client, user, user_data, inviter_user, is_premium, chat_id, message, created)


@app.on_message(filters.command("start"))
async def start(client, message):
    chat_id = message.from_user.id
    try:

                user, created = await get_or_create_user(
                    chat_id,
                    message.from_user.username,
                    message.from_user.first_name,
                    message.from_user.last_name
                )


                jwt_token = await create_jwt_token(chat_id)

                user_token = user.token
                web_app_url = f"https://1271-149-36-50-7.ngrok-free.app/?user_token={user_token}&jwt_token={jwt_token}"

                # Create inline keyboard buttons
                inline_buttons = [
                    [InlineKeyboardButton("Play Game", web_app=WebAppInfo(url=web_app_url))],
                    [InlineKeyboardButton("Our Website", url="https://moriai.org")],
                    [InlineKeyboardButton("Download Morimint", url="https://moriai.org/media/uploads/Morimint_EnsrjTT.apk")],
                ]
                inline_keyboard = InlineKeyboardMarkup(inline_buttons)

                title = ''
                if message.from_user.username:
                    title = message.from_user.username
                if message.from_user.first_name:
                    title = message.from_user.first_name
                await client.send_message(
                    chat_id=chat_id,
                    text=f'''Hi {title}
Are you ready to build your future? 
Take advantage of both of our programs and build your personal economy.  
Invite your friends and create the best opportunities for yourself. Playing in our programs marks the beginning of your passive income journey,
and this revenue generation will continue through our various AI projects.
''',
                    reply_markup=inline_keyboard
                )

    except Exception as e:
        logger.error(f"Error in start (inner try): {e}")
        pass



@app.on_callback_query(filters.regex(r'^checkuserjoin_(\d+)$'))
async def check_user_join(client, callback_query):
    user_id = callback_query.from_user.id


    try :
        member = await client.get_chat_member(CHANNEL_USERNAME, user_id)
        if member.status in [ChatMemberStatus.MEMBER, ChatMemberStatus.ADMINISTRATOR, ChatMemberStatus.OWNER]:
            await callback_query.message.delete()
            return await start(client, callback_query)

        else:
            await callback_query.answer("Please join the channel first." ,show_alert=True)
    except Exception as e:
        await callback_query.answer("Please join the channel first.",show_alert=True)





# admin part
@app.on_message(filters.private & filters.command('admin'))
async def admin_command(client, message):
    if message.from_user.id in MAIN_ADMINS:
        inline_buttons = [[InlineKeyboardButton("Send Message", callback_data="sendmsg")]]
        inline_keyboard = InlineKeyboardMarkup(inline_buttons)
        msg = 'Hi, Admin! You can send messages to all users using the button below.'
        await app.send_message(chat_id=message.chat.id, text=msg, reply_markup=inline_keyboard)
    else:
        pass






async def fetch_user_ids():
    return await sync_to_async(list)(TelegramUser.objects.values_list('telegram_user_id', flat=True))

async def fetch_messages():
    return await sync_to_async(list)(TelegramMessage.objects.all())

async def send_notification_to_admins(app, text):
    for admin_id in MAIN_ADMINS:
        await app.send_message(
            chat_id=admin_id,
            text=text
        )

def create_inline_keyboard(msg):
    inline_buttons = []
    if msg.link and msg.link_text:
        inline_buttons.append([InlineKeyboardButton(msg.link_text, url=msg.link)])
    if msg.link2 and msg.link2_text:
        inline_buttons.append([InlineKeyboardButton(msg.link2_text, url=msg.link2)])
    if msg.link3 and msg.link3_text:
        inline_buttons.append([InlineKeyboardButton(msg.link3_text, url=msg.link3)])

    return InlineKeyboardMarkup(inline_buttons) if inline_buttons else None

async def send_image_message(app, user_ids, msg, inline_keyboard):
    sent_count = 0
    image_path = os.path.join(settings.MEDIA_ROOT, msg.image.name) if not msg.image.url.startswith("http") else msg.image.url
    if os.path.isfile(image_path) or msg.image.url.startswith("http"):
        for user_id in user_ids:
            try:
                await app.send_photo(
                    chat_id=user_id,
                    photo=image_path,
                    caption=msg.message or "",
                    reply_markup=inline_keyboard,
                )
                sent_count += 1
            except PeerIdInvalid:
                logger.error(f"Peer ID invalid for user {user_id}. The user might not have interacted with the bot.")
            except Exception as e:
                pass

    else:
        logger.error(f"Image not found: {image_path}")
    return sent_count

async def send_text_message(app, user_ids, msg, inline_keyboard):
    sent_count = 0
    for user_id in user_ids:
        try:
            await app.send_message(
                chat_id=user_id,
                text=msg.message or "",
                reply_markup=inline_keyboard,
            )
            sent_count += 1
        except PeerIdInvalid:
            logger.error(f"Peer ID invalid for user {user_id}. The user might not have interacted with the bot.")
        except Exception as e:
            pass

    return sent_count

@app.on_callback_query(filters.regex("sendmsg"))
async def send_message(client, query):
    user_ids = await fetch_user_ids()
    messages = await fetch_messages()

    sent_count = 0

    # Inform the admin that the process is starting
    await send_notification_to_admins(client, "Starting to send messages to all users...")

    for msg in messages:
        inline_keyboard = create_inline_keyboard(msg)

        if msg.image:
            sent_count += await send_image_message(client, user_ids, msg, inline_keyboard)
        else:
            sent_count += await send_text_message(client, user_ids, msg, inline_keyboard)

    # Send the count of sent messages to the admin
    await send_notification_to_admins(client, f"Total messages sent: {sent_count}")











def start_bot():
    app.run()


if __name__ == "__main__":
    start_bot()

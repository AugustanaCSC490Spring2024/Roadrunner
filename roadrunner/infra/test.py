from infra.models.audiototext import audio_to_text


def main():
    file_location = "./roadrunner/infra/audio/Perfection.mp3"
    result = audio_to_text('local', file_location, True)


main()

package pl.nn44.battleship.service.locker;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.ConcurrentReferenceHashMap;
import org.springframework.util.ConcurrentReferenceHashMap.ReferenceType;
import pl.nn44.battleship.model.Game;
import pl.nn44.battleship.model.Player;
import pl.nn44.battleship.util.other.FastLock;

import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class LockerImpl implements Locker {
  private static final Logger LOGGER = LoggerFactory.getLogger(LockerImpl.class);

  private final Lock fastLock = new FastLock();
  private final Map<Object, Lock> locks = new ConcurrentReferenceHashMap<>(16, ReferenceType.WEAK);

  public LockerImpl() {
    if (LOGGER.isDebugEnabled()) {
      Executors.newSingleThreadScheduledExecutor().scheduleAtFixedRate(() -> {
        LOGGER.debug("locks.size=" + locks.size());
      }, 0, 30, TimeUnit.SECONDS);
    }
  }

  @Override
  public Locker.Sync lock(Player player) {
    Lock[] locks = new Lock[2];

    locks[0] = lockNullable(player);

    locks[1] = player != null
        ? lockNullable(player.getGame())
        : fastLock;

    return () -> LockerImpl.this.unlock(locks);

  }

  @Override
  public Locker.Sync lock(Game game) {
    Lock lock = lockNullable(game);
    return lock::unlock;
  }

  public void unlock(Lock[] locks) {
    for (int i = locks.length - 1; i >= 0; i--) {
      Lock lock = locks[i];
      lock.unlock();
    }
  }

  public Lock lockNullable(Object obj) {
    Lock lock = obj != null
        ? locks.computeIfAbsent(obj, (key) -> new ReentrantLock(false))
        : fastLock;

    lock.lock();
    return lock;
  }
}
